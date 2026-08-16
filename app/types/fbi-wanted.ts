export interface FBIWantedListResponse {
  total: number
  page: number
  items: FBISuspect[]
}

export interface FBIImage {
  caption?: string | null
  large?: string
  thumb?: string
  original?: string
}

export interface FBIFile {
  url: string
  name: string
}

export interface FBISuspect {
  uid: string
  title: string
  description?: string
  details?: string
  warning_message?: string | null
  reward_text?: string
  reward_min?: number
  reward_max?: number
  aliases?: string[] | null
  subjects?: string[]
  locations?: string[] | null
  field_offices?: string[]
  images?: FBIImage[]
  files?: FBIFile[]
  race?: string | null
  race_raw?: string | null
  sex?: string | null
  hair?: string | null
  hair_raw?: string | null
  eyes?: string | null
  eyes_raw?: string | null
  height_min?: number | null
  height_max?: number | null
  weight_min?: number | null
  weight_max?: number | null
  age_min?: number | null
  age_max?: number | null
  nationality?: string | null
  place_of_birth?: string | null
  dates_of_birth_used?: string[] | null
  occupations?: string[] | null
  languages?: string[] | null
  complexion?: string | null
  build?: string | null
  scars_and_marks?: string | null
  remarks?: string | null
  caution?: string | null
  additional_information?: string | null
  person_classification?: string
  poster_classification?: string
  status?: string
  publication?: string
  modified?: string | null
  url?: string
  path?: string
  pathId?: string
  possible_countries?: string[] | null
  possible_states?: string[] | null
  legat_names?: string[] | null
  coordinates?: [number, number][]
  ncic?: string | null
}
