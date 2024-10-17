'use client'

import { api } from '@corale/api/convex/_generated/api'
import { AdminPageWrapper } from '@corale/esuite/app/admin/AdminPageWrapper'
import { cn } from '@corale/esuite/app/lib/utils'
import { ImageCardNext } from '@corale/esuite/components/images/ImageCardNext'
import { InfiniteScroll } from '@corale/esuite/components/ui/InfiniteScroll'
import { Loader } from '@corale/esuite/components/ui/Loader'
import { usePaginatedQuery } from 'convex/react'

export default function Page() {
  const imagesQuery = usePaginatedQuery(api.db.admin.see.latestImages, {}, { initialNumItems: 50 })

  return (
    <AdminPageWrapper className="">
      <div className="grid grid-cols-6 place-items-center gap-3">
        {imagesQuery.results.map((image) =>
          image ? <ImageCardNext key={image._id} image={image} sizes="16vw" /> : null,
        )}
      </div>

      <InfiniteScroll
        hasMore={imagesQuery.status === 'CanLoadMore'}
        isLoading={imagesQuery.isLoading}
        next={() => imagesQuery.loadMore(50)}
      >
        <div className={cn('mx-auto mt-1', imagesQuery.status === 'Exhausted' && 'hidden')}>
          <Loader type="dotPulse" />
        </div>
      </InfiniteScroll>
    </AdminPageWrapper>
  )
}
