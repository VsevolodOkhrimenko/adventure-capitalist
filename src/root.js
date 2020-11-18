import React, { Suspense } from 'react'
import Loader from 'components/Loader'


const AppPage = React.lazy(() => import('containers/AppPage'))

const Root = () => (
  <Suspense fallback={<Loader />}>
    <AppPage />
  </Suspense>
)

export default Root
