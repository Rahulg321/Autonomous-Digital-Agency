FROM docker.io/cloudflare/sandbox:0.11.0

# Agency template uses bun — install it in the sandbox image.
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"
