import puppeteer from 'puppeteer';
import { IResume } from '../models/Resume';
export async function generatePDF(resume: IResume): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    const htmlContent = generateResumeHTML(resume);
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 1
    });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}
function generateResumeHTML(resume: IResume): string {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };
  const getDateRange = (startDate: string, endDate?: string, current?: boolean) => {
    const start = formatDate(startDate);
    const end = current ? 'Present' : formatDate(endDate || '');
    return `${start} - ${end}`;
  };
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${resume.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .name {
          font-size: 32px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .contact-info {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 10px;
        }
        .contact-links {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .contact-links a {
          color: #2563eb;
          text-decoration: none;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
        }
        .experience-item, .education-item {
          margin-bottom: 20px;
          padding-left: 20px;
          border-left: 4px solid #2563eb;
        }
        .experience-header, .education-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        .job-title, .degree {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
        }
        .company, .institution {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 5px;
        }
        .date-range {
          font-size: 14px;
          color: #6b7280;
          font-style: italic;
        }
        .location {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .description {
          margin-bottom: 10px;
          color: #374151;
        }
        .achievements {
          list-style-type: disc;
          margin-left: 20px;
          color: #374151;
        }
        .achievements li {
          margin-bottom: 3px;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }
        .skill-item {
          background-color: #f3f4f6;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
        }
        .skill-name {
          font-weight: 600;
          color: #1f2937;
        }
        .skill-level {
          color: #6b7280;
          font-size: 12px;
          text-transform: capitalize;
        }
        .project-item {
          margin-bottom: 20px;
          padding-left: 20px;
          border-left: 4px solid #8b5cf6;
        }
        .project-name {
          font-size: 16px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 5px;
        }
        .project-description {
          margin-bottom: 8px;
          color: #374151;
        }
        .project-tech {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        .project-links {
          font-size: 14px;
        }
        .project-links a {
          color: #2563eb;
          text-decoration: none;
          margin-right: 15px;
        }
        .summary {
          font-size: 16px;
          line-height: 1.8;
          color: #374151;
          text-align: justify;
        }
        @media print {
          body {
            padding: 0;
          }
          .section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${resume.personalInfo.firstName} ${resume.personalInfo.lastName}</div>
        <div class="contact-info">${resume.personalInfo.email}</div>
        <div class="contact-links">
          ${resume.personalInfo.phone ? `<span>${resume.personalInfo.phone}</span>` : ''}
          ${resume.personalInfo.location ? `<span>${resume.personalInfo.location}</span>` : ''}
          ${resume.personalInfo.linkedin ? `<a href="${resume.personalInfo.linkedin}">LinkedIn</a>` : ''}
          ${resume.personalInfo.github ? `<a href="${resume.personalInfo.github}">GitHub</a>` : ''}
          ${resume.personalInfo.website ? `<a href="${resume.personalInfo.website}">Website</a>` : ''}
        </div>
      </div>
      ${resume.personalInfo.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="summary">${resume.personalInfo.summary}</div>
        </div>
      ` : ''}
      ${resume.experience && resume.experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Professional Experience</div>
          ${resume.experience.map(exp => `
            <div class="experience-item">
              <div class="experience-header">
                <div class="job-title">${exp.jobTitle}</div>
                <div class="date-range">${getDateRange(exp.startDate, exp.endDate, exp.current)}</div>
              </div>
              <div class="company">${exp.company}</div>
              ${exp.location ? `<div class="location">${exp.location}</div>` : ''}
              <div class="description">${exp.description}</div>
              ${exp.achievements && exp.achievements.length > 0 ? `
                <ul class="achievements">
                  ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      ${resume.education && resume.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${resume.education.map(edu => `
            <div class="education-item">
              <div class="education-header">
                <div class="degree">${edu.degree}</div>
                <div class="date-range">${getDateRange(edu.startDate, edu.endDate, edu.current)}</div>
              </div>
              <div class="institution">${edu.institution}</div>
              ${edu.location ? `<div class="location">${edu.location}</div>` : ''}
              <div class="contact-links">
                ${edu.gpa ? `<span>GPA: ${edu.gpa}</span>` : ''}
                ${edu.honors ? `<span>${edu.honors}</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      ${resume.skills && resume.skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-grid">
            ${resume.skills.map(skill => `
              <div class="skill-item">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">(${skill.level})</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      ${resume.projects && resume.projects.length > 0 ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${resume.projects.map(project => `
            <div class="project-item">
              <div class="project-name">${project.name}</div>
              <div class="project-description">${project.description}</div>
              ${project.technologies && project.technologies.length > 0 ? `
                <div class="project-tech"><strong>Technologies:</strong> ${project.technologies.join(', ')}</div>
              ` : ''}
              <div class="project-links">
                ${project.githubUrl ? `<a href="${project.githubUrl}">GitHub</a>` : ''}
                ${project.url ? `<a href="${project.url}">Live Demo</a>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `;
} 