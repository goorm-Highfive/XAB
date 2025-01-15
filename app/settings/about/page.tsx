import { Card, CardContent } from '~/components/ui/card'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="mx-auto mt-6 max-w-3xl space-y-6 text-center">
          <Card>
            <CardContent>
              <div className="container mx-auto px-4 py-8">
                <h1 className="mb-4 text-4xl font-bold">About Us</h1>
                <p className="mb-6 text-lg leading-relaxed">
                  Welcome to our platform! Our mission is to provide
                  high-quality services and a great user experience. We are
                  dedicated to continuously improving and value your feedback to
                  make our platform better for everyone.
                </p>
                <h2 className="mb-4 text-2xl font-semibold">Our Vision</h2>
                <p className="mb-6 text-lg leading-relaxed">
                  We aim to create a platform that empowers individuals and
                  businesses to achieve their goals seamlessly. Innovation and
                  customer satisfaction are at the heart of what we do.
                </p>
                <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
                <p className="text-lg leading-relaxed">
                  If you have any questions or suggestions, feel free to reach
                  out to us at{' '}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600 underline"
                  >
                    xAB@example.com
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
