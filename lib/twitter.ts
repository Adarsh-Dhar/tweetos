import { TwitterApi } from 'twitter-api-v2';

// Twitter API configuration
export interface TwitterConfig {
  apiKey: string;
  apiKeySecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

// Create a Twitter client
export const createTwitterClient = (config: TwitterConfig) => {
  return new TwitterApi({
    appKey: config.apiKey,
    appSecret: config.apiKeySecret,
    accessToken: config.accessToken,
    accessSecret: config.accessTokenSecret,
  });
};

// Function to verify Twitter credentials
export const verifyCredentials = async (config: TwitterConfig) => {
  try {
    const client = createTwitterClient(config);
    const user = await client.v2.me();
    return { success: true, user };
  } catch (error) {
    return { success: false, error };
  }
};

// Function to post a tweet
export const postTweet = async (config: TwitterConfig, text: string) => {
  try {
    const client = createTwitterClient(config);
    const tweet = await client.v2.tweet(text);
    return { success: true, tweet };
  } catch (error) {
    return { success: false, error };
  }
};

// Function to search tweets by hashtag
export const searchTweets = async (config: TwitterConfig, hashtag: string, maxResults = 10) => {
  try {
    const client = createTwitterClient(config);
    const tweets = await client.v2.search({
      query: hashtag,
      max_results: maxResults,
    });
    return { success: true, tweets };
  } catch (error) {
    return { success: false, error };
  }
};

// Function to follow a user
export const followUser = async (config: TwitterConfig, userId: string) => {
  try {
    const client = createTwitterClient(config);
    // First get the authenticated user's ID
    const me = await client.v2.me();
    // Then use both the authenticated user ID and target user ID for follow
    const result = await client.v2.follow(me.data.id, userId);
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
};
