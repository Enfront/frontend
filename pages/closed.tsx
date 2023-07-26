import Link from 'next/link';

function Closed(): JSX.Element {
  return (
    <div className="flex h-screen flex-col bg-white pb-12 pt-16">
      <main className="mx-auto flex w-full max-w-7xl grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 justify-center">
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}`}>
            <a className="inline-flex">
              <span className="sr-only">Enfront</span>
            </a>
          </Link>
        </div>
        <div className="py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Shop closed</h1>
            <p className="mt-4 text-base text-gray-500">
              Sorry, the owner of this shop has temporarily closed it for maintenance.
            </p>
            <div className="mt-6">
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}`}>
                <a className="text-base font-medium text-black">
                  Go back home<span aria-hidden="true"> &rarr;</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-7xl shrink-0 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-4">
          <span className="text-sm font-medium text-gray-500 hover:text-gray-600">Contact Support</span>

          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-500 hover:text-gray-600">Status</span>

          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-500 hover:text-gray-600">Twitter</span>
        </nav>
      </footer>
    </div>
  );
}

export default Closed;
