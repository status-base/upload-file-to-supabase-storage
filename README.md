<p align="center">
  <a href="https://github.com/status-base/upload-file-to-supabase-storage/actions/workflows/test.yml"><img alt="upload-file-to-supabase-storage status" src="https://github.com/status-base/upload-file-to-supabase-storage/actions/workflows/test.yml/badge.svg"></a>
</p>

# Upload file to Supabase Storage

You may want to perform some screenshot, or generate txt file and store those data to Supabase Bucket, and this is the tools for you!

## Inputs

### `file_path`

Path name of the file to be uploaded.

eg: "public/screenshots.png"

### `bucket`

Name of the bucket to upload to

eg: "screenshot"

### `content_type`

[Supabase Storage](https://supabase.com/docs/reference/javascript/storage-from-upload#parameters) `from.upload` fileOptions parameter, the `Content-Type` header value.

eg: "image/png"

### `cache_control`

[Supabase Storage](https://supabase.com/docs/reference/javascript/storage-from-upload#parameters) `from.upload` fileOptions parameter, the `Content-Control` value.

eg: "3600"

### `upsert`

[Supabase Storage](https://supabase.com/docs/reference/javascript/storage-from-upload#parameters) `from.upload` fileOptions parameter, the `Upsert` value.

eg: "true"

## Env

### `SUPABASE_URL`

Go to [Dashboard Settings](https://app.supabase.com/project/<your-project-ref>/settings/api), copy and paste the **URL** into GitHub Repo's secret.

### `SUPABASE_ANON_KEY`

Go to [Dashboard Settings](https://app.supabase.com/project/<your-project-ref>/settings/api), copy and paste the **Anon Key** into GitHub Repo's secret.

## Usage/Example

In `.github/workflows/screenshot.yml`

```yml
name: Screenshot Action
on:
  push:
    branches: -master

env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Screenshot Website
        id: screenshot
        uses: swinton/screenshot-website@v1.x
        with:
          source: https://github.com
          destination: screenshot.png

      - name: Upload image to Storage
        uses: status-base/upload-file-to-supabase-storage@v1.0.2
        with:
          file_path: ${{ steps.screenshot.outputs.path }}  // generated from previous step
          bucket: website
          content_type: image/png
          upsert: true
```
