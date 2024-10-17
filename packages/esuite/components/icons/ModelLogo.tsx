import { Claude } from '@/components/icons/models/Claude'
import { Cohere } from '@/components/icons/models/Cohere'
import { DeepSeek } from '@/components/icons/models/DeepSeek'
import { Gemini } from '@/components/icons/models/Gemini'
import { Gemma } from '@/components/icons/models/Gemma'
import { Meta } from '@/components/icons/models/Meta'
import { Mistral } from '@/components/icons/models/Mistral'
import { OpenAI } from '@/components/icons/models/OpenAI'
import { Perplexity } from '@/components/icons/models/Perplexity'
import { Yi } from '@/components/icons/models/Yi'
import { ZeroOne } from '@/components/icons/models/ZeroOne'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { memo, type SVGProps } from 'react'

const brandIcons = [
  {
    name: ['anthropic', 'claude'],
    icon: Claude,
  },
  {
    name: ['cohere'],
    icon: Cohere,
  },
  {
    name: ['deepseek'],
    icon: DeepSeek,
  },
  {
    name: ['gemini'],
    icon: Gemini,
  },
  {
    name: ['gemma'],
    icon: Gemma,
  },
  {
    name: ['01.AI', '01ai'],
    icon: ZeroOne,
  },

  {
    name: ['mistral', 'mixtral'],
    icon: Mistral,
  },
  {
    name: ['openai', 'gpt-'],
    icon: OpenAI,
  },
  {
    name: ['perplexity'],
    icon: Perplexity,
  },
  {
    name: ['yi'],
    icon: Yi,
  },
  {
    name: ['meta', 'llama'],
    icon: Meta,
  },
]

const fallback = Icons.Cube

export const ModelLogo = memo(
  ({ modelName, ...props }: { modelName: string } & SVGProps<SVGSVGElement> & { size?: string | number }) => {
    const matchingIcon = brandIcons.find((brand) =>
      brand.name.some((name) => modelName.toLowerCase().includes(name.toLowerCase())),
    )

    const IconComponent = matchingIcon ? matchingIcon.icon : fallback

    return <IconComponent {...props} />
  },
)
ModelLogo.displayName = 'ModelLogo'

/* 
 modelName samples:

 Meta: Llama 3.1 405B Instruct
 OpenAI: GPT-4o-mini (2024-07-18)
 Perplexity: Llama 3.1 Sonar 70B Online
 Dolphin 2.6 Mixtral 8x7B 🐬

*/
