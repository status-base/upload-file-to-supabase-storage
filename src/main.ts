import core from '@actions/core'
import {createClient} from '@supabase/supabase-js'
import {promises as fs} from 'fs'

const PATH = process.env.GITHUB_WORKSPACE
  ? `${process.env.GITHUB_WORKSPACE}/screenshots/`
  : `screenshots/`

async function run(): Promise<void> {
  try {
    const bucket = core.getInput('bucket')
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      core.setOutput('result', 'No videos or screenshots found!')
      return
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const files = await fs.readdir(PATH)
    if (!files.length) {
      core.setOutput('result', 'No videos or screenshots found!')
      return
    }

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const filename = files[i]
      const buffer = await fs.readFile(filename)

      const {data, error} = await supabase.storage
        .from(bucket)
        .upload(filename, buffer, {
          contentType: 'image/jpeg'
        })

      if (error) throw new Error(error.message)
      core.setOutput('result', data?.Key)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
