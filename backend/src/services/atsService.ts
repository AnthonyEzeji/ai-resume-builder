import OpenAI from 'openai';
import natural from 'natural';
import { IResume } from '../models/Resume';
let openai: OpenAI | null = null;
try {
  const apiKey = process.env.OPENAI_API_KEY || 'development-fallback-key';
  if (apiKey !== 'development-fallback-key') {
    openai = new OpenAI({ apiKey });
  }
} catch (error) {
  console.warn('OpenAI API not available, using fallback responses');
}
export interface ATSAnalysis {
  overallScore: number;
  keywordMatch: number;
  formatScore: number;
  contentScore: number;
  suggestions: string[];
}
export async function analyzeResume(resume: IResume, jobDescription?: string): Promise<ATSAnalysis> {
  try {
    const resumeText = extractResumeText(resume);
    const keywordMatch = jobDescription ? 
      await analyzeKeywordMatch(resumeText, jobDescription) : 75;
    const formatScore = analyzeFormat(resume);
    const contentScore = await analyzeContent(resumeText);
    const overallScore = Math.round(
      (keywordMatch * 0.4) + (formatScore * 0.3) + (contentScore * 0.3)
    );
    const suggestions = await generateSuggestions(resume, jobDescription);
    return {
      overallScore,
      keywordMatch,
      formatScore,
      contentScore,
      suggestions
    };
  } catch (error) {
    console.error('ATS analysis error:', error);
    return {
      overallScore: 50,
      keywordMatch: 50,
      formatScore: 50,
      contentScore: 50,
      suggestions: ['Unable to analyze resume at this time']
    };
  }
}
function extractResumeText(resume: IResume): string {
  const sections = [];
  sections.push(`${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`);
  sections.push(resume.personalInfo.summary);
  resume.experience.forEach(exp => {
    sections.push(`${exp.jobTitle} at ${exp.company}`);
    sections.push(exp.description);
    exp.achievements.forEach(achievement => sections.push(achievement));
  });
  resume.education.forEach(edu => {
    sections.push(`${edu.degree} from ${edu.institution}`);
    if (edu.honors) sections.push(edu.honors);
    if (edu.relevantCoursework) {
      edu.relevantCoursework.forEach(course => sections.push(course));
    }
  });
  resume.skills.forEach(skill => sections.push(skill.name));
  if (resume.projects) {
    resume.projects.forEach(project => {
      sections.push(project.name);
      sections.push(project.description);
      project.technologies.forEach(tech => sections.push(tech));
    });
  }
  return sections.join(' ').toLowerCase();
}
async function analyzeKeywordMatch(resumeText: string, jobDescription: string): Promise<number> {
  try {
    const jobKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);
    const matchedKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.includes(keyword)
    );
    const matchPercentage = (matchedKeywords.length / jobKeywords.length) * 100;
    return Math.min(100, Math.max(0, matchPercentage));
  } catch (error) {
    console.error('Keyword analysis error:', error);
    return 50;
  }
}
function extractKeywords(text: string): string[] {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
  ]);
  return tokens
    .filter(token => 
      token && 
      token.length > 2 && 
      !stopWords.has(token) &&
      /^[a-zA-Z]+$/.test(token)
    )
    .slice(0, 50); 
}
function analyzeFormat(resume: IResume): number {
  let score = 100;
  const requiredSections = ['personalInfo', 'experience', 'education', 'skills'];
  const missingSections = requiredSections.filter(section => {
    const data = (resume as any)[section];
    return !data || (Array.isArray(data) && data.length === 0);
  });
  score -= missingSections.length * 15;
  if (resume.personalInfo.summary.length < 50) score -= 10;
  if (resume.experience.length === 0) score -= 20;
  if (resume.education.length === 0) score -= 15;
  if (resume.skills.length < 3) score -= 10;
  const actionVerbs = [
    'developed', 'implemented', 'managed', 'created', 'designed', 'built',
    'improved', 'increased', 'decreased', 'led', 'coordinated', 'analyzed'
  ];
  const hasActionVerbs = resume.experience.some(exp => 
    actionVerbs.some(verb => 
      exp.description.toLowerCase().includes(verb) ||
      exp.achievements.some(achievement => 
        achievement.toLowerCase().includes(verb)
      )
    )
  );
  if (!hasActionVerbs) score -= 10;
  return Math.max(0, score);
}
async function analyzeContent(resumeText: string): Promise<number> {
  try {
    if (!openai) {
      let score = 70;
      if (resumeText.length > 500) score += 10;
      if (/\d+%|\d+x|\$\d+|\d+/.test(resumeText)) score += 15; 
      if (resumeText.includes('developed') || resumeText.includes('managed')) score += 5;
      return Math.min(100, score);
    }
    const prompt = `
      Analyze the following resume content and rate it from 0-100 based on:
      1. Professional tone and language
      2. Specificity and quantifiable achievements
      3. Relevance and impact of content
      4. Grammar and clarity
      Resume content: ${resumeText.substring(0, 2000)}
      Return only a number between 0-100.
    `;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
      temperature: 0.1
    });
    const score = parseInt(completion.choices[0]?.message?.content || '50');
    return Math.max(0, Math.min(100, score));
  } catch (error) {
    console.error('Content analysis error:', error);
    return 70; 
  }
}
async function generateSuggestions(resume: IResume, jobDescription?: string): Promise<string[]> {
  try {
    const suggestions = [];
    if (resume.personalInfo.summary.length < 100) {
      suggestions.push('Expand your professional summary to be more comprehensive');
    }
    if (resume.experience.length < 2) {
      suggestions.push('Add more work experience to strengthen your resume');
    }
    if (resume.skills.length < 5) {
      suggestions.push('Include more relevant skills for your target role');
    }
    const hasQuantifiableResults = resume.experience.some(exp =>
      /\d+%|\d+x|\$\d+|\d+/.test(exp.description) ||
      exp.achievements.some(achievement => /\d+%|\d+x|\$\d+|\d+/.test(achievement))
    );
    if (!hasQuantifiableResults) {
      suggestions.push('Add quantifiable achievements and metrics to your experience');
    }
    if (jobDescription) {
      const aiSuggestions = await getAISuggestions(resume, jobDescription);
      suggestions.push(...aiSuggestions);
    }
    return suggestions.slice(0, 5); 
  } catch (error) {
    console.error('Suggestion generation error:', error);
    return ['Focus on adding more specific achievements and metrics'];
  }
}
async function getAISuggestions(resume: IResume, jobDescription: string): Promise<string[]> {
  try {
    if (!openai) {
      return [
        'Add more quantifiable achievements and metrics to your experience',
        'Include relevant keywords from the job description',
        'Expand your skills section with role-specific technologies'
      ];
    }
    const prompt = `
      Given this resume and job description, provide 2-3 specific suggestions to improve the resume for this role.
      Job Description: ${jobDescription.substring(0, 1000)}
      Resume Summary: ${resume.personalInfo.summary}
      Key Skills: ${resume.skills.map(s => s.name).join(', ')}
      Provide only the suggestions, one per line, without numbering or bullet points.
    `;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    });
    const content = completion.choices[0]?.message?.content || '';
    return content.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error('AI suggestions error:', error);
    return ['Focus on adding more specific achievements and metrics'];
  }
} 