import mongoose, { Document, Schema } from 'mongoose';
export interface ITemplateStyle {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    size: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      small: string;
    };
    weight: {
      heading: string;
      body: string;
    };
  };
  layout: {
    columns: number;
    spacing: string;
    margins: string;
    sectionSpacing: string;
    borderRadius: string;
  };
  sections: {
    header: {
      layout: 'centered' | 'left' | 'right';
      backgroundColor?: string;
      textAlign: 'left' | 'center' | 'right';
    };
    experience: {
      style: 'timeline' | 'list' | 'cards';
      showDates: boolean;
      showLocation: boolean;
    };
    skills: {
      style: 'bars' | 'badges' | 'list' | 'grid';
      showLevel: boolean;
      groupByCategory: boolean;
    };
    education: {
      style: 'detailed' | 'compact';
      showGPA: boolean;
      showCoursework: boolean;
    };
  };
}
export interface ITemplateComponent {
  id: string;
  name: string;
  type: 'header' | 'section' | 'experience-item' | 'education-item' | 'skill-group';
  html: string;
  css: string;
  props?: Record<string, any>;
}
export interface ITemplate extends Document {
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'executive' | 'modern' | 'minimal' | 'academic';
  style: ITemplateStyle;
  components: ITemplateComponent[];
  layout: {
    sections: string[]; 
    sidebar?: {
      enabled: boolean;
      position: 'left' | 'right';
      sections: string[];
    };
  };
  preview: {
    thumbnail: string; 
    fullPreview: string; 
  };
  isPremium: boolean;
  isActive: boolean;
  tags: string[];
  usageCount: number;
  rating: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const templateStyleSchema = new Schema<ITemplateStyle>({
  colors: {
    primary: { type: String, required: true },
    secondary: { type: String, required: true },
    accent: { type: String, required: true },
    text: { type: String, required: true },
    background: { type: String, required: true },
    border: { type: String, required: true }
  },
  fonts: {
    heading: { type: String, required: true },
    body: { type: String, required: true },
    size: {
      h1: String,
      h2: String,
      h3: String,
      body: String,
      small: String
    },
    weight: {
      heading: String,
      body: String
    }
  },
  layout: {
    columns: { type: Number, default: 1 },
    spacing: String,
    margins: String,
    sectionSpacing: String,
    borderRadius: String
  },
  sections: {
    header: {
      layout: { type: String, enum: ['centered', 'left', 'right'], default: 'centered' },
      backgroundColor: String,
      textAlign: { type: String, enum: ['left', 'center', 'right'], default: 'center' }
    },
    experience: {
      style: { type: String, enum: ['timeline', 'list', 'cards'], default: 'list' },
      showDates: { type: Boolean, default: true },
      showLocation: { type: Boolean, default: true }
    },
    skills: {
      style: { type: String, enum: ['bars', 'badges', 'list', 'grid'], default: 'badges' },
      showLevel: { type: Boolean, default: true },
      groupByCategory: { type: Boolean, default: true }
    },
    education: {
      style: { type: String, enum: ['detailed', 'compact'], default: 'detailed' },
      showGPA: { type: Boolean, default: false },
      showCoursework: { type: Boolean, default: false }
    }
  }
});
const templateComponentSchema = new Schema<ITemplateComponent>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['header', 'section', 'experience-item', 'education-item', 'skill-group']
  },
  html: { type: String, required: true },
  css: { type: String, required: true },
  props: { type: Schema.Types.Mixed }
});
const templateSchema = new Schema<ITemplate>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['professional', 'creative', 'executive', 'modern', 'minimal', 'academic']
  },
  style: {
    type: templateStyleSchema,
    required: true
  },
  components: [templateComponentSchema],
  layout: {
    sections: [{ type: String }],
    sidebar: {
      enabled: { type: Boolean, default: false },
      position: { type: String, enum: ['left', 'right'], default: 'right' },
      sections: [{ type: String }]
    }
  },
  preview: {
    thumbnail: String,
    fullPreview: String
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
templateSchema.index({ category: 1, isActive: 1 });
templateSchema.index({ isPremium: 1, isActive: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ usageCount: -1 });
templateSchema.index({ rating: -1 });
export default mongoose.model<ITemplate>('Template', templateSchema); 