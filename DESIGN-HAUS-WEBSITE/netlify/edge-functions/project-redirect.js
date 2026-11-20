export default async (request, context) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (id) {
    return Response.redirect(new URL(`/projects/${encodeURIComponent(id)}`, url.origin), 301);
  }
  return Response.redirect(new URL('/projects', url.origin), 301);
};

export const config = {
  path: ["/project-details", "/project-details.html"]
};
