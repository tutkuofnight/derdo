import AppLayout from "@/layouts/app-layout"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/options"
import { Playlist } from "@shared/types"

import { getUserPlaylists } from "@/services/playlist"

import FormManager from "../../../components/TrackUploadFields/form-manager";

export default async function UploadPage(){
  
  return true
}