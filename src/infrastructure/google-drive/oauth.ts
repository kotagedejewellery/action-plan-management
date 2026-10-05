import { google } from "googleapis";

const driveScope = "https://www.googleapis.com/auth/drive.file";

function required(name: "GOOGLE_OAUTH_CLIENT_ID" | "GOOGLE_OAUTH_CLIENT_SECRET" | "GOOGLE_OAUTH_REDIRECT_URI" | "GOOGLE_OAUTH_REFRESH_TOKEN" | "GOOGLE_DRIVE_FOLDER_ID") {
  const value = process.env[name];
  if (!value) throw new Error(`Environment variable ${name} belum dikonfigurasi.`);
  return value;
}

export function googleDriveOAuthClient() {
  return new google.auth.OAuth2(required("GOOGLE_OAUTH_CLIENT_ID"), required("GOOGLE_OAUTH_CLIENT_SECRET"), required("GOOGLE_OAUTH_REDIRECT_URI"));
}

export function googleDriveClient() {
  const auth = googleDriveOAuthClient();
  auth.setCredentials({ refresh_token: required("GOOGLE_OAUTH_REFRESH_TOKEN") });
  return google.drive({ version: "v3", auth });
}

export function driveFolderId() {
  return required("GOOGLE_DRIVE_FOLDER_ID");
}

export { driveScope };
