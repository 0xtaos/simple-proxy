# 🚀 Vercel API Proxy

This is a lightweight API proxy service deployed on Vercel, specifically designed to solve Cross-Origin Resource Sharing (CORS) issues and hide sensitive credentials.

---

## ✨ Core Features

*   **One-Click Deploy** 🚀: Deploy the project to your own account with just a few clicks using the Vercel button.
*   **Secure & Controlled** 🛡️: Configure allowed target domain whitelist through environment variables to prevent proxy abuse.
*   **Privacy Protection** 🤫: Support removing sensitive information from request headers (like `Cookie`, `Authorization`) to protect user privacy and credential security.
*   **Lightweight & Focused** 🎯: The project does one thing only—proxy API requests, maintaining high performance and simplicity.

## 🛠️ How to Use

After successful deployment, you'll get a dedicated Vercel domain. Use the following format to proxy your target API:

https://{your-vercel-domain}/api/proxy?target={target-path}


> **Parameter Description**:
> *   `{your-vercel-domain}`: The domain automatically generated after your successful Vercel deployment, e.g., `https://your-vercel-app.vercel.app`.
> *   `{target-path}`: The complete path of the API you want to proxy.
>
> **Example**:
>
> Then the URL you need to access should be:
> ```
> https://your-vercel-app.vercel.app/proxy?url=https%3A//api.example.com/data
> ```

## ⚙️ Configuration Guide

You can easily customize the proxy behavior by setting environment variables in your Vercel project.

*   ### `ALLOWED_TARGETS` (Required)
    *   **Function**: Configure the whitelist of target domains allowed for proxying. Only domains in this list will be successfully proxied.
    *   **Format**: Multiple domains should be separated by commas `,`.
    *   **Example**:
        ```
        github.com,api.example.com,another.service.org
        ```

*   ### `HEADERS_TO_REMOVE` (Optional)
    *   **Function**: Configure which fields to remove from the original request headers before forwarding to the target server. This is crucial for security and privacy.
    *   **Format**: Multiple header fields should be separated by commas `,` (case-insensitive).
    *   **Example**:
        ```
        cookie,authorization,referer,x-custom-auth
        ```

## 🚀 One-Click Deploy

You can easily deploy this project to your own Vercel account.

1.  Click the "Deploy with Vercel" button below.
2.  On Vercel's import page, it will prompt you to create a Git repository, just authorize it.
3.  Enter the project configuration page, **expand the "Environment Variables" tab**, and add necessary environment variables (at least `ALLOWED_TARGETS` is required).
4.  Click "Deploy" and wait a moment for deployment to complete!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/0xtaos/simple-proxy.git)

---

Hope this project helps! Feel free to raise Issues or Pull Requests.

