import React from 'react'
import dynamic from 'next/dynamic'
import useSWRMutation from 'swr/mutation'
import { biocompute_icon } from '@/icons'
import { fetcherPOST } from '@/utils/next-rest-fetcher'
import { ResponseCodedError } from '@/spec/error'
import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

const Bp5Popover = dynamic(() => import('@blueprintjs/core').then(({ Popover }) => Popover))
const Bp5Menu = dynamic(() => import('@blueprintjs/core').then(({ Menu }) => Menu))
const Bp5MenuItem = dynamic(() => import('@blueprintjs/core').then(({ MenuItem }) => MenuItem))
const Bp5Spinner = dynamic(() => import('@blueprintjs/core').then(({ Spinner }) => Spinner))
const Bp5Alert = dynamic(() => import('@blueprintjs/core').then(({ Alert }) => Alert))
const Icon = dynamic(() => import('@/app/components/icon'))

export default function BCOButton({ session_id, id, metadata, disabled }: { session_id?: string, id?: string, metadata: { title: string, description: string | undefined }, disabled: boolean }) {
  const router = useRouter()
  const { trigger, isMutating, error } = useSWRMutation(id ? `${session_id ? `/api/socket/${session_id}` : ''}/api/bco/${id}/draft` : null, fetcherPOST<undefined, { object_id: string }>)
  const [showError, setShowError] = React.useState(false)
  React.useEffect(() => {
    if (error) {
      console.error(error)
      setShowError(() => true)
      if ((error as ResponseCodedError).message === 'ORCID Expired') {
        signOut().then(() => signIn('orcid'))
      } else if ((error as ResponseCodedError).message === 'ORCID Required') {
        router.push(`/account/biocompute?callback=${decodeURIComponent(window.location.href)}`)
      } else if((error as ResponseCodedError).message === 'BCO Unauthorization') {
        router.push(`/account/biocompute?callback=${decodeURIComponent(window.location.href)}`)
      }
    }
  }, [error])
  if (!id) return null
  else if (isMutating) return <Bp5Spinner className="inline-block" size={20} />
  return (
    <>
      <Bp5Popover
        className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        disabled={disabled}
        content={
          <Bp5Menu>
            <a href={`/api/bco/${id}?metadata=${encodeURIComponent(JSON.stringify(metadata))}`} download={`${(metadata.title || id).replace(/ /g, '-')}-bco.json`}>
              <Bp5MenuItem
                icon="document"
                text="Download BCO"
              />
            </a>
            <Bp5MenuItem
              icon="send-to"
              text="Draft in BioCompute Portal"
              onClick={async (evt) => {
                trigger().then((res) => {
                  if (res) window.open(`https://biocomputeobject.org/builder?${res.object_id}`, '_blank')
                })
              }}
            />
          </Bp5Menu>
        }
        placement="bottom"
      >
        <Icon
          icon={biocompute_icon}
          className={disabled ? 'fill-gray-400' : 'fill-black dark:fill-white'}
          title={disabled ? 'Save to Create BCO' : 'Create BCO'}
        />
      </Bp5Popover>
      <Bp5Alert
        confirmButtonText="Okay"
        icon="error"
        intent="danger"
        isOpen={showError}
        canEscapeKeyCancel
        canOutsideClickCancel
        onCancel={() => {setShowError(false)}}
        onConfirm={() => {setShowError(false)}}
      >{error ? (error as ResponseCodedError).message === 'ORCID Required' ? <>This feature requires your account to be linked with ORCID</>
              : <>An error ocurred while attempting to register the BCO: {(error as ResponseCodedError).message}</>
              : null}
      </Bp5Alert>
    </>
  )
}
