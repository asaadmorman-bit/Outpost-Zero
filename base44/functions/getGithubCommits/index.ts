import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = Deno.env.get('Github');
    if (!token) {
      return Response.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    const owner = 'asaadmorman-bit';
    const repo = 'Outpost-Zero';

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OutpostZero-App'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ error: `GitHub API error: ${response.status}`, details: errorText }, { status: response.status });
    }

    const commits = await response.json();

    const simplified = commits.map(c => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message.split('\n')[0],
      author: c.commit.author.name,
      date: c.commit.author.date,
      url: c.html_url
    }));

    return Response.json({ commits: simplified, repo: `${owner}/${repo}` });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});