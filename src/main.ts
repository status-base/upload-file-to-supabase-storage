import * as core from '@actions/core'
import {basename} from 'path'
import {createClient} from '@supabase/supabase-js'
import {promises as fs} from 'fs'

async function run(): Promise<void> {
  try {
    const bucket = core.getInput('bucket')
    const contentType = core.getInput('content_type')
    const cacheControl = core.getInput('cache_control')
    const upsert = core.getInput('upsert') === 'true'
    const filePath = core.getInput('file_path')

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('No supabase url or anon key is found!')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    core.debug(`Reading file: ${filePath}`)
    const buffer = await fs.readFile(filePath)

    const {data, error} = await supabase.storage
      .from(bucket)
      .upload(basename(filePath), buffer, {
        contentType,
        cacheControl,
        upsert
      })

    if (error) throw new Error(error.message)
    core.debug(`Media Key: ${data?.Key}`)
    core.setOutput('result', data?.Key)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
