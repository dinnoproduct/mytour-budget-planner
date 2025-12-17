import { useState } from 'react'
import { type ProfileDetailsModalProps, type ProfileFormData } from './types.ts'
import { Layout } from './Layout.tsx'
import { useUpdateUser, useUserContext } from '@entities/user'
import { SuccessView } from '@widgets/ProfileDetailsModal/ui/SuccessView.tsx'
import { ProfileDetailsForm } from './ProfileDetailsForm.tsx'

export const ProfileDetailsModal = ({
  closeModal,
  onSuccess
}: ProfileDetailsModalProps) => {
  const { mutateAsync: updateUserAsync, isPending: isLoadingUpdateUser } =
    useUpdateUser()
  const { user } = useUserContext()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return

    try {
      await updateUserAsync({
        id: user.id,
        ...data
      })
      setShowSuccess(true)
      onSuccess?.()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout isOpen={true} closeModal={closeModal}>
      {showSuccess ? (
        <SuccessView />
      ) : (
        <ProfileDetailsForm
          formData={{
            firstname: user?.firstName || '',
            lastname: user?.lastName || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || ''
          }}
          onSubmit={handleSubmit}
          isLoading={isLoadingUpdateUser}
        />
      )}
    </Layout>
  )
}
