import { Card, CardContent } from '~/components/ui/card'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="mx-auto mt-6 max-w-3xl space-y-6 text-center">
          <Card>
            <CardContent>
              <div className="container mx-auto px-4 py-8">
                <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>
                <p className="mb-6 text-lg leading-relaxed">
                  By using our platform, you agree to the following terms and
                  conditions. Please read them carefully before proceeding.
                </p>
                <h2 className="mb-4 text-2xl font-semibold">
                  1. Acceptance of Terms
                </h2>
                <p className="mb-6 text-lg leading-relaxed">
                  By accessing or using our services, you agree to be bound by
                  these Terms of Service and our Privacy Policy.
                </p>
                <h2 className="mb-4 text-2xl font-semibold">
                  2. User Responsibilities
                </h2>
                <p className="mb-6 text-lg leading-relaxed">
                  You agree to use our platform responsibly and not engage in
                  any activities that harm the platform or other users.
                </p>
                <h2 className="mb-4 text-2xl font-semibold">
                  3. Limitation of Liability
                </h2>
                <p className="mb-6 text-lg leading-relaxed">
                  We are not liable for any damages arising from the use of our
                  platform. Use it at your own risk.
                </p>
                <h2 className="mb-4 text-2xl font-semibold">
                  4. Changes to Terms
                </h2>
                <p className="text-lg leading-relaxed">
                  We reserve the right to update these terms at any time.
                  Continued use of the platform indicates your acceptance of the
                  changes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
