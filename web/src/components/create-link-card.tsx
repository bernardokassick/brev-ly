import { useForm } from 'react-hook-form'
import { Button } from './common/button'
import { Input } from './common/input'
import { Label } from './common/label'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createLinkForm,
  type CreateLinkForm,
} from '@/schemas/create-link-form.schema'
import { linkService } from '@/services/http'
import { Warning } from '@phosphor-icons/react/dist/icons/Warning'
import { toast } from 'react-toastify'
import { getApiErrorMessage } from '@/services/api-error-handler'

interface CreateLinkCardProps {
  refetch: () => void
}

export const CreateLinkCard = ({ refetch }: CreateLinkCardProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLinkForm>({ resolver: zodResolver(createLinkForm) })

  const handleSubmitForm = async (data: CreateLinkForm) => {
    try {
      await linkService.createLink(data.originalUrl, data.shortUrl)
      reset()
      refetch()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex h-fit flex-col rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur transition-all duration-300 hover:shadow-2xl"
    >
      <h1 className="mb-6 text-2xl font-semibold text-gray-700">Adicionar novo link</h1>

      <div className="flex flex-col gap-5">
        {/* Campo Original URL */}
        <div className="flex flex-col gap-1">
          <label htmlFor="originalUrl" className="text-sm font-medium text-gray-600">
            Link original: 
          </label>
          <input
            id="originalUrl"
            type="url"
            placeholder="https://www.exemplo.com.br"
            className={`rounded-lg border px-4 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
              errors.originalUrl
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-indigo-400'
            }`}
            {...register('originalUrl')}
          />
          {errors.originalUrl?.message && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <Warning size={14} /> {errors.originalUrl.message}
            </p>
          )}
        </div>

        {/* Campo Short URL */}
        <div className="flex flex-col gap-1">
          <label htmlFor="shortUrl" className="text-sm font-medium text-gray-600">
            Link encurtado: 
          </label>
          <input
            id="shortUrl"
            type="text"
            placeholder="brev.ly/meulink"
            className={`rounded-lg border px-4 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
              errors.shortUrl
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-indigo-400'
            }`}
            {...register('shortUrl')}
          />
          {errors.shortUrl?.message && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <Warning size={14} /> {errors.shortUrl.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar link'}
      </button>
    </form>
  )
}

