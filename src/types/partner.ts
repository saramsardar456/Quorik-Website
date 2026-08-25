export type PartnerTrackType = 'agency-software-house' | 'certified-solution-integrator' | 'strategic-referral' | 'white-label-reseller' | string;

export type PartnerStatus = 'new' | 'in_review' | 'approved' | 'onboarded' | 'declined';

export interface PartnerApplication {
  id: string;
  companyName: string;
  websiteUrl: string;
  partnerTrack: PartnerTrackType;
  clientBaseSize: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  status: PartnerStatus;
  estimatedPipeline?: string;
  internalNotes?: string;
  commissionTier?: string;
  createdAt: string;
  updatedAt?: string;
}
