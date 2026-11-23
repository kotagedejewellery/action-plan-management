import { GoogleSheetsActionPlanApprovalRepository, GoogleSheetsActionPlanRepository, GoogleSheetsDivisionRepository, GoogleSheetsStatusRepository, GoogleSheetsUserRepository, GoogleSheetsWeeklyPlanRepository } from "@/infrastructure/google-sheets/repositories";
import { GoogleDriveAttachmentStorage } from "@/infrastructure/google-drive/attachments";
import { GoogleDriveNoteImageStorage } from "@/infrastructure/google-drive/note-images";
import { PostgresNoteImageRepository, PostgresNoteRepository, PostgresNoteWorkspaceRepository } from "@/infrastructure/notes/postgres";

export const users = new GoogleSheetsUserRepository();
export const actionPlans = new GoogleSheetsActionPlanRepository();
export const approvals = new GoogleSheetsActionPlanApprovalRepository();
export const statuses = new GoogleSheetsStatusRepository();
export const weeklyPlans = new GoogleSheetsWeeklyPlanRepository();
export const attachments = new GoogleDriveAttachmentStorage();
export const noteWorkspaces = new PostgresNoteWorkspaceRepository();
export const notes = new PostgresNoteRepository();
export const noteImages = new PostgresNoteImageRepository();
export const noteImageStorage = new GoogleDriveNoteImageStorage();

export const divisions = new GoogleSheetsDivisionRepository();
