"use client"

import { useMemo } from "react"
import { useRepoStore } from "@/store/useRepoStore"

import { Layers } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#e11d48",
  "#0891b2",
  "#ca8a04",
]

export function LanguageDistribution() {

  const repo = useRepoStore(
    s => s.repo
  )

  const data = useMemo(() => {

    if (!repo) return []

    const arr = Object.entries(
      repo.languages
    ).map(([name, lang]) => ({
      name,
      value: lang.blanks
    }))

    arr.sort(
      (a, b) => b.value - a.value
    )

    return arr

  }, [repo])


  if (!repo || data.length === 0)
    return null


  const total = data.reduce(
    (sum, l) => sum + l.value,
    0
  )


  return (
    <Card className="mt-8">

      <CardHeader>

        <CardTitle className="flex gap-1.5 items-center text-muted-foreground">
          <Layers size={16} />
          Languages
        </CardTitle>

      </CardHeader>


      <CardContent className="space-y-4">

        <div className="flex w-full h-2 rounded-full overflow-hidden">

          {
            data.map((lang, index) => {

              const percentRaw =
                lang.value / total * 100

              if (percentRaw <= 0)
                return null

              return (

                <div
                  key={lang.name}
                  style={{
                    width: `${percentRaw}%`,
                    backgroundColor:
                      COLORS[index % COLORS.length]
                  }}
                />

              )

            })
          }

        </div>

        <div className="flex flex-wrap gap-4 text-xs">

          {
            data.map((lang, index) => {

              const percentRaw =
                lang.value / total * 100

              if (percentRaw <= 0)
                return null

              const percent =
                percentRaw.toFixed(1)

              return (

                <div
                  key={lang.name}
                  className="flex items-center gap-1.5"
                >

                  <span
                    className="inline-block w-2 h-2 rounded-sm"
                    style={{
                      backgroundColor:
                        COLORS[index % COLORS.length]
                    }}
                  />

                  <span>

                    {lang.name}

                  </span>

                  <span className="text-muted-foreground">

                    {percent}%

                  </span>

                </div>

              )

            })
          }

        </div>

      </CardContent>

    </Card>
  )

}