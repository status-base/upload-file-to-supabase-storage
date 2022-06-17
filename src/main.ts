import * as core from '@actions/core'
import {createClient} from '@supabase/supabase-js'
import {promises as fs} from 'fs'

async function run(): Promise<void> {
  try {
    const bucket = core.getInput('bucket')
    const contentType = core.getInput('content_type')
    const cacheControl = core.getInput('cache_control')
    const upsert = core.getInput('upsert') === 'true'
    const fileName = core.getInput('file_name')
    const fileDir = core.getInput('file_directory')

    const PATH = process.env.GITHUB_WORKSPACE
      ? `${process.env.GITHUB_WORKSPACE}/${fileDir !== '' ? `${fileDir}/` : ''}`
      : `${fileDir !== '' ? `${fileDir}/` : ''}`

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('No supabase url or anon key is found!')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const files = await fs.readdir(PATH)
    if (!files.length) {
      throw new Error('No videos or screenshots found!')
    }

    const buffer = await fs.readFile(`${PATH}/${fileName}`)

    const {data, error} = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType,
        cacheControl,
        upsert
      })

    if (error) throw new Error(error.message)
    core.setOutput('result', data?.Key)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
