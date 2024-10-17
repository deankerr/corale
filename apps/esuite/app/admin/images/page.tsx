'use client'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { cn } from '@/app/lib/utils'
import { ImageCardNext } from '@/components/images/ImageCardNext'
import { InfiniteScroll } from '@/components/ui/InfiniteScroll'
import { Loader } from '@/components/ui/Loader'
import { api } from '@corale/api/convex/_generated/api'
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
