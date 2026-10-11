import React from "react"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"

const UniCardSkeleton = () => {
  return (
    <div className="border border-[hsl(var(--border))] bg-white/80 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <Stack spacing={1} className="p-5">
        {/* Neon shimmer for image */}
        <Skeleton
          variant="rectangular"
          height={160}
          sx={{
            borderRadius: "12px",
            bgcolor: "hsl(var(--neon-lime))", // subtle neon lime tint
            animationDuration: "1.2s",
          }}
        />

        {/* Text shimmer with purple hue */}
        <Skeleton
          variant="text"
          height={28}
          width="70%"
          sx={{
            bgcolor: "hsl(var(--neon-purple))",
            animationDuration: "1.2s",
          }}
        />
        <Skeleton
          variant="text"
          height={20}
          width="40%"
          sx={{
            bgcolor: "hsl(var(--neon-purple))",
            animationDuration: "1.2s",
          }}
        />

        {/* Button shimmer */}
        <Skeleton
          variant="rounded"
          height={38}
          width="100%"
          sx={{
            borderRadius: "10px",
            bgcolor: "hsl(var(--neon-lime))",
            animationDuration: "1.2s",
          }}
        />
      </Stack>
    </div>
  )
}

export default UniCardSkeleton
