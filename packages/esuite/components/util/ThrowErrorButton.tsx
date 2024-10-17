'use client'

import React, { useState } from 'react'

import { Button } from '../ui/Button'

export default function ThrowErrorButton({
  children = 'Throw',
  ...props
}: React.ComponentProps<typeof Button>) {
  const [raiseError, setRaiseError] = useState(false)

  if (raiseError) {
    // "a" is undefined so "props.a.b" will result in an error
    return (props as any).a.b
  } else {
    return (
      <Button onClick={() => setRaiseError((error) => !error)} color="red">
        {children}
      </Button>
    )
  }
}
