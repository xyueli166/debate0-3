import fetch from 'node-fetch';

// 用于进行搜索请求的函数
async function searchWithSerper(query, type = 'search') {
  try {
    const endpoint = 'https://google.serper.dev/search';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.SERPER_API_KEY,  // 从环境变量获取 API key
      },
      body: JSON.stringify({
        q: type === 'scholar' ? `site:scholar.google.com ${query}` : query,
        num: 20,
        type: type === 'scholar' ? 'scholar' : 'search'
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`${type} search error:`, error);
    return null;
  }
}

// 用于进行简单搜索的函数
export async function performSimpleSearch(query) {
  try {
    const searchResults = await searchWithSerper(query);
    return searchResults;
  } catch (error) {
    console.error('Simple search error:', error);
    throw error;
  }
}

// 用于进行组合搜索的函数，包含中英文和学术搜索
export async function performCombinedSearch(query, englishQuery) {
  const searches = [
    searchWithSerper(query),                  // 中文通用搜索
    searchWithSerper(englishQuery),           // 英文通用搜索
    searchWithSerper(query, 'scholar'),       // 中文学术搜索
    searchWithSerper(englishQuery, 'scholar') // 英文学术搜索
  ];

  const [
    chineseResults,
    englishResults,
    chineseScholarResults,
    englishScholarResults
  ] = await Promise.all(searches);

  return {
    general: {
      chinese: chineseResults,
      english: englishResults
    },
    scholar: {
      chinese: chineseScholarResults,
      english: englishScholarResults
    },
    originalTopic: query,
    englishTopic: englishQuery
  };
}

// Serverless API handler
export default async function apihandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, englishQuery, searchMode } = req.body;

  if (!query || !englishQuery) {
    return res.status(400).json({ error: 'Both query and englishQuery are required' });
  }

  try {
    let searchResults;

    if (searchMode === 'simple') {
      searchResults = await performSimpleSearch(query);
    } else {
      searchResults = await performCombinedSearch(query, englishQuery);
    }

    return res.status(200).json({ searchResults });
  } catch (error) {
    console.error('Search handler error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
