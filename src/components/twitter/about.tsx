'use client';

import { useEffect, useState } from 'react';
import { getInformation } from './edit/information/action';
import { getContact } from './edit/contact/action';
import { getAttachment } from '@/components/onboarding/attachment/action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, GraduationCap, Mail, MapPin, Calendar, Briefcase, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getCountryLabel, getLocalityLabel, getMonthLabel } from '@/utils/getArabicLabel';
import { FaTwitter, FaFacebook, FaLinkedin, FaTelegram, FaInstagram, FaTiktok, FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export interface AboutUserData {
  name?: string | null;
  fullname?: string | null;
  description?: string | null;
  birthCountry?: string | null;
  birthState?: string | null;
  birthLocality?: string | null;
  birthMonth?: number | null;
  birthYear?: number | null;
  currentLocality?: string | null;
  currentCountry?: string | null;
  currentState?: string | null;
  educationLevel?: string | null;
  institution?: string | null;
  currentOccupation?: string | null;
  employmentSector?: string | null;
  workplaceAddress?: string | null;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  telegram?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  phdInstitution?: string | null;
  phdMajor?: string | null;
  phdCompletionYear?: string | null;
  masterInstitution?: string | null;
  masterMajor?: string | null;
  masterCompletionYear?: string | null;
  bachelorInstitution?: string | null;
  bachelorMajor?: string | null;
  bachelorCompletionYear?: string | null;
}

export default function About({ userData }: { userData: AboutUserData | null }) {
  if (!userData || Object.values(userData).filter(Boolean).length < 3) {
    return (
      <div className="text-center text-muted-foreground py-8 px-4">
        لا توجد معلومات كافية. يرجى إكمال ملفك الشخصي.
      </div>
    );
  }
  return (
    <div className="space-y-6 py-4 px-1 pb-10">
      {/* Bio/Description */}
      {userData.description && userData.description.trim() !== 'Voluntary member: Yes, Role: N/A, Dates: N/A to N/A' && (
        <Card className="border-0 shadow-none">
          <CardContent className="p-4">
            <p className="text-sm text-foreground">{userData.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Social & Contacts */}
      {(userData.email || userData.phone || userData.whatsapp || userData.twitter || userData.facebook || userData.linkedin || userData.telegram || userData.instagram || userData.tiktok) && (
        <Card>
          <CardContent className="pt-6">
            <TooltipProvider>
              <div className="flex flex-wrap gap-4 items-center">
                {userData.email && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={`mailto:${userData.email}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-2 group">
                        <FaEnvelope size={28} className="text-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{userData.email}</TooltipContent>
                  </Tooltip>
                )}
                {userData.phone && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={`tel:${userData.phone}`} className="hover:opacity-70 transition-opacity flex items-center gap-2 group">
                        <FaPhone size={24} className="text-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{userData.phone}</TooltipContent>
                  </Tooltip>
                )}
                {userData.whatsapp && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={`https://wa.me/${userData.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-2 group">
                        <FaWhatsapp size={30} className="text-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{userData.whatsapp}</TooltipContent>
                  </Tooltip>
                )}
                {userData.twitter && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={userData.twitter.startsWith('http') ? userData.twitter : `https://twitter.com/${userData.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity group">
                        <FaTwitter size={28} className="text-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{userData.twitter}</TooltipContent>
                  </Tooltip>
                )}
                {userData.facebook && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={userData.facebook.startsWith('http') ? userData.facebook : `https://facebook.com/${userData.facebook}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity group">
                        <FaFacebook size={28} className="text-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{userData.facebook}</TooltipContent>
                  </Tooltip>
                )}
                {userData.linkedin && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={userData.linkedin.startsWith('http') ? userData.linkedin : `https://linkedin.com/in/${userData.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity group">
                        <FaLinkedin size={28} className="text-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{userData.linkedin}</TooltipContent>
                  </Tooltip>
                )}
                {userData.telegram && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={userData.telegram.startsWith('http') ? userData.telegram : `https://t.me/${userData.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity group">
                        <FaTelegram size={28} className="text-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{userData.telegram}</TooltipContent>
                  </Tooltip>
                )}
                {userData.instagram && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={userData.instagram.startsWith('http') ? userData.instagram : `https://instagram.com/${userData.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity group">
                        <FaInstagram size={28} className="text-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{userData.instagram}</TooltipContent>
                  </Tooltip>
                )}
                {userData.tiktok && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={userData.tiktok.startsWith('http') ? userData.tiktok : `https://tiktok.com/@${userData.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity group">
                        <FaTiktok size={28} className="text-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{userData.tiktok}</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>
      )}

      {/* Info List */}
      <div className="space-y-4 px-5">
        {/* Current Location */}
        {(userData.currentCountry || userData.currentLocality) && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={18} className="text-muted-foreground" />
            <span>
              يقيم في
              {userData.currentCountry && ` ${getCountryLabel(userData.currentCountry)}`}
              {userData.currentLocality && ` - ${getLocalityLabel(userData.currentLocality).replace('محلية ', '')}`}
            </span>
          </div>
        )}

        {/* Birth Location */}
        {(userData.birthCountry || userData.birthLocality) && (
          <div className="flex items-center gap-2 text-sm">
            <Home size={18} className="text-muted-foreground" />
            <span>
              من
              {userData.birthCountry && ` ${getCountryLabel(userData.birthCountry)}`}
              {userData.birthLocality && ` - ${getLocalityLabel(userData.birthLocality).replace('محلية ', '')}`}
            </span>
          </div>
        )}

        {/* Birth date */}
        {(userData.birthMonth && userData.birthYear) && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={18} className="text-muted-foreground" />
            <span>
              ولد في :
              {` ${getMonthLabel(userData.birthMonth.toString())} ${userData.birthYear}`}
            </span>
          </div>
        )}

        {/* Education */}
        <div className="space-y-2">
          {/* PhD */}
          {userData.phdInstitution && (
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-muted-foreground" />
              <span className="text-sm">
                دكتوراه{userData.phdMajor ? `، ${userData.phdMajor}` : ''}
                {userData.phdInstitution ? `، ${userData.phdInstitution}` : ''}
                {userData.phdCompletionYear ? ` - ${userData.phdCompletionYear}` : ''}
              </span>
            </div>
          )}
          {/* Master */}
          {userData.masterInstitution && (
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-muted-foreground" />
              <span className="text-sm">
                ماجستير{userData.masterMajor ? `، ${userData.masterMajor}` : ''}
                {userData.masterInstitution ? `، ${userData.masterInstitution}` : ''}
                {userData.masterCompletionYear ? ` - ${userData.masterCompletionYear}` : ''}
              </span>
            </div>
          )}
          {/* Bachelor */}
          {userData.bachelorInstitution && (
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-muted-foreground" />
              <span className="text-sm">
                بكالوريوس{userData.bachelorMajor ? `، ${userData.bachelorMajor}` : ''}
                {userData.bachelorInstitution ? `، ${userData.bachelorInstitution}` : ''}
                {userData.bachelorCompletionYear ? ` - ${userData.bachelorCompletionYear}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Work */}
        {(userData.currentOccupation || userData.employmentSector || userData.companyName) && (
          <div className="flex items-center gap-2 text-sm">
            <Briefcase size={18} className="text-muted-foreground" />
            <span>
              {userData.currentOccupation && `${userData.currentOccupation}`}
              {userData.companyName && ` في ${userData.companyName}`}
              {userData.employmentSector && ` (${userData.employmentSector})`}
            </span>
          </div>
        )}        

        {/* Work Location */}
        {userData.workplaceAddress && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 size={18} className="text-muted-foreground" />
            <span>يعمل في {userData.workplaceAddress}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 py-4 px-1">
      <Skeleton className="h-24 w-full" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-full max-w-[250px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
