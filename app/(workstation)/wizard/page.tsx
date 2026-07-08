import { redirect } from 'next/navigation'

/** Legacy route — redirect to /case/create */
export default function WizardRedirectPage() {
  redirect('/case/create')
}
