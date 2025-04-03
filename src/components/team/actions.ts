'use server';

import { TEAM_MEMBERS } from './constant';
import { TeamFormValues, TeamMember } from './types';

// Mock database operations with timeout to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage
let teamMembers = [...TEAM_MEMBERS];

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    // Simulate API delay
    await delay(500);
    return teamMembers;
  } catch (error) {
    console.error("Error getting team members:", error);
    throw new Error("Failed to get team members");
  }
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  try {
    // Simulate API delay
    await delay(300);
    const member = teamMembers.find(member => member.id === id) || null;
    return member;
  } catch (error) {
    console.error(`Error getting team member with ID ${id}:`, error);
    throw new Error("Failed to get team member");
  }
}

export async function createTeamMember(data: TeamFormValues): Promise<TeamMember> {
  try {
    // Simulate API delay
    await delay(800);

    // Check if ID already exists
    if (teamMembers.some(member => member.id === data.id)) {
      throw new Error(`Team member with ID ${data.id} already exists`);
    }

    const newMember: TeamMember = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      src: data.src,
      alt: data.alt || `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      mail: data.mail,
      location: data.location,
      width: data.width || 105,
      height: data.height || 105,
      iqama: data.iqama,
      eligible: data.eligible || [],
    };

    teamMembers.push(newMember);
    return newMember;
  } catch (error) {
    console.error("Error creating team member:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create team member");
  }
}

export async function updateTeamMember(id: string, data: Partial<TeamFormValues>): Promise<TeamMember> {
  try {
    // Simulate API delay
    await delay(800);

    const memberIndex = teamMembers.findIndex(member => member.id === id);
    if (memberIndex === -1) {
      throw new Error(`Team member with ID ${id} not found`);
    }

    const updatedMember = {
      ...teamMembers[memberIndex],
      ...data,
      alt: data.alt || `${data.firstName || teamMembers[memberIndex].firstName} ${data.lastName || teamMembers[memberIndex].lastName}`,
    };

    teamMembers[memberIndex] = updatedMember;
    return updatedMember;
  } catch (error) {
    console.error(`Error updating team member with ID ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update team member");
  }
}

export async function deleteTeamMember(id: string): Promise<void> {
  try {
    // Simulate API delay
    await delay(800);

    const memberIndex = teamMembers.findIndex(member => member.id === id);
    if (memberIndex === -1) {
      throw new Error(`Team member with ID ${id} not found`);
    }

    teamMembers = teamMembers.filter(member => member.id !== id);
  } catch (error) {
    console.error(`Error deleting team member with ID ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to delete team member");
  }
} 