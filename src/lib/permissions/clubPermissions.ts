import type { Prisma } from '@prisma/client';

import { createOrgPermissionsCheck } from './orgPermissions';
import {
	createAllPermissionObject,
	createNonePermissionObject,
	createPermissionsCheck,
	type PermissionDescriptions
} from './permissions';

export const permissionObjectDescriptions = Object.freeze({
	admin: 'Gives role all permissions',
	updateAppearance: 'Allows changing the banner and name of the club',
	updateDescription: 'Update the about me for the club',
	manageAnnouncements: 'Allows a user to send out announcements',
	manageRoles: 'Allows a user to create new roles',
	manageEvents: 'Allows a user to create new events',
	manageMembers: 'Allows a user to manage other members of the club',
	viewSettings: 'Allows a user to view the settings page.',
	viewAttendance: 'View attendance',
	manageAttendance: 'Change attendance, take attendance, etc.'
}) satisfies PermissionDescriptions;

export type ClubPermissionKeys = keyof typeof permissionObjectDescriptions;
export type TypedPermissionObject<K> = Record<ClubPermissionKeys, K>;
export type PermissionObject = TypedPermissionObject<boolean>;

export const keys = Object.keys(permissionObjectDescriptions) as ClubPermissionKeys[];

export const createClubPermissionsCheck = createPermissionsCheck(keys);

type UserLike = Prisma.UserGetPayload<{
	select: {
		id: true;
		clubUsers: {
			select: {
				clubId: true;
				owner: true;
				role: {
					select: {
						permissionInt: true;
					};
				};
			};
		};
		orgUsers: {
			select: {
				organizationId: true;
				owner: true;
				role: {
					select: {
						permissionInt: true;
					};
				};
			};
		};
	};
}>;

interface ClubLike {
	id: number;
	organizationId: number;
}

export const createClubPermissionsFromUser = (
	user?: UserLike | null,
	club?: ClubLike | null
): PermissionObject => {
	// User has no club users, thus, no permissions
	if (!user?.clubUsers) {
		return createNonePermissionObject(keys);
	}

	const clubUser = user?.clubUsers.find((clubUser) => clubUser.clubId == club?.id);

	if (user.orgUsers) {
		const orgUser = user?.orgUsers.find(
			(orgUser) => orgUser.organizationId == club?.organizationId
		);

		// Permissible if the user is the owner of the organization
		if (orgUser?.owner) {
			return createAllPermissionObject(keys);
		}

		// If the user has the right permissions for the organization, they can manage clubs
		if (orgUser?.role?.permissionInt) {
			const orgPerms = createOrgPermissionsCheck(orgUser.role.permissionInt);

			if (orgPerms.admin || orgPerms.manageClubs) {
				return createAllPermissionObject(keys);
			}
		}
	}

	if (clubUser?.owner) {
		// Create a permission object with all permissions
		return createAllPermissionObject(keys);
	} else {
		const clubUser = user?.clubUsers.find((clubUser) => clubUser.clubId == club?.id);

		if (!clubUser?.role) {
			return createNonePermissionObject(keys);
		}

		return createClubPermissionsCheck(clubUser.role.permissionInt);
	}
};
