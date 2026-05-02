import React from 'react'
import { Button } from '../ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const ThemeButton = () => {
   const { resolvedTheme, setTheme } = useTheme()
  const handleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }
  return (

     <Button
          variant="ghost"
          size="icon"
          className="size-10    relative"
          onClick={handleTheme}
        >
           {
        resolvedTheme === 'dark' ? 
        <Sun /> : <Moon />
      }
        </Button>

    
  )
}

export default ThemeButton