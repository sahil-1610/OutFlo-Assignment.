import mongoose, { Document } from "mongoose";

export enum CampaignStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED", // Keep this for internal use
}

export interface ICampaign extends Document {
  name: string;
  description: string;
  status: CampaignStatus;
  linkedInUrls: string[];
  accountIds: string[];
  leadsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [CampaignStatus.ACTIVE, CampaignStatus.INACTIVE], // Only allow ACTIVE/INACTIVE for direct updates
      default: CampaignStatus.INACTIVE,
    },
    linkedInUrls: {
      type: [String],
      default: [],
    },
    accountIds: {
      type: [String],
      default: [],
    },
    leadsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Update leadsCount before saving
campaignSchema.pre<ICampaign>("save", function (next) {
  if (Array.isArray(this.accountIds)) {
    this.leadsCount = this.accountIds.length;
  }
  next();
});

// Update leadsCount before updating
campaignSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  const update = this.getUpdate() as any;
  if (update?.accountIds || update?.$set?.accountIds) {
    const accounts = update.accountIds || update.$set.accountIds;
    if (!update.$set) update.$set = {};
    update.$set.leadsCount = Array.isArray(accounts) ? accounts.length : 0;
  }
  next();
});

// Ensure virtuals are included in JSON output
campaignSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model<ICampaign>("Campaign", campaignSchema);
