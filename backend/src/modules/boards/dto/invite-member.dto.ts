export enum UserRole {
  owner = 'owner',
  member = 'member',
}

export class InviteMemberDto {
  email: string
  boardId: string
  role: UserRole
  inviterId: string
}