/**
 * This file is autogenerated by cli/sync-api-import.ts
 *  and exports all API routes recursively in this directory.
 * It is designed to be imported client-side.
 */
import { APIInterface } from '@/spec/api'
import type { UserIntegrationsCAVATICA as UserIntegrationsCAVATICA_ } from './v1/user/integrations/cavatica'
export const UserIntegrationsCAVATICA = APIInterface<typeof UserIntegrationsCAVATICA_>("/api/v1/user/integrations/cavatica", "GET")
import type { UserIntegrationsCAVATICAUpdate as UserIntegrationsCAVATICAUpdate_ } from './v1/user/integrations/cavatica'
export const UserIntegrationsCAVATICAUpdate = APIInterface<typeof UserIntegrationsCAVATICAUpdate_>("/api/v1/user/integrations/cavatica/update", "POST")
import type { PublicUserPlaybooks as PublicUserPlaybooks_ } from './v1/user/playbooks'
export const PublicUserPlaybooks = APIInterface<typeof PublicUserPlaybooks_>("/api/v1/public/user/playbooks", "GET")
import type { UserPlaybooks as UserPlaybooks_ } from './v1/user/playbooks'
export const UserPlaybooks = APIInterface<typeof UserPlaybooks_>("/api/v1/user/playbooks", "GET")
import type { UserPlaybook as UserPlaybook_ } from './v1/user/playbooks'
export const UserPlaybook = APIInterface<typeof UserPlaybook_>("/api/v1/user/playbooks/[id]", "GET")
import type { UpdateUserPlaybook as UpdateUserPlaybook_ } from './v1/user/playbooks'
export const UpdateUserPlaybook = APIInterface<typeof UpdateUserPlaybook_>("/api/v1/user/playbooks/[id]/update", "POST")
import type { PublishUserPlaybook as PublishUserPlaybook_ } from './v1/user/playbooks'
export const PublishUserPlaybook = APIInterface<typeof PublishUserPlaybook_>("/api/v1/user/playbooks/[id]/publish", "POST")
import type { DeleteUserPlaybook as DeleteUserPlaybook_ } from './v1/user/playbooks'
export const DeleteUserPlaybook = APIInterface<typeof DeleteUserPlaybook_>("/api/v1/user/playbooks/[id]/delete", "POST")