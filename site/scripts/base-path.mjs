// GitHub project sites live below /repository-name/; custom domains use /.
const value = process.env.BASE_PATH || '/';
const segments = value.split('/').filter(Boolean);
export const basePath = segments.length ? `/${segments.join('/')}/` : '/';
if (!/^\/(?:[A-Za-z0-9._~-]+\/)*$/.test(basePath) || basePath.split('/').some(part => part === '.' || part === '..')) {
  throw new Error('BASE_PATH must be a URL path such as / or /emerging-patterns/.');
}
