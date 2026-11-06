// NoSQL Databases Reference Solution: Aggregations
// MongoDB aggregations for analytics

// ============================================
// === BASIC AGGREGATIONS ===
// ============================================

// $match to filter documents
// Business question: Get posts created in 2024
db.posts.aggregate([
  {
    $match: {
      created_at: {
        $gte: new Date('2024-01-01'),
        $lt: new Date('2025-01-01')
      }
    }
  }
]);

// $group to group by field
// Business question: Count posts per user
db.posts.aggregate([
  {
    $group: {
      _id: '$author_id',
      post_count: { $sum: 1 }
    }
  }
]);

// $project to reshape documents
// Business question: Get user names and email only
db.users.aggregate([
  {
    $project: {
      username: 1,
      email: 1,
      _id: 0
    }
  }
]);

// $sort to sort results
// Business question: Get posts sorted by creation date
db.posts.aggregate([
  {
    $sort: { created_at: -1 }
  }
]);

// ============================================
// === COUNT AND SUM AGGREGATIONS ===
// ============================================

// Count posts per user
// Business question: How many posts has each user created?
db.posts.aggregate([
  {
    $group: {
      _id: '$author_id',
      post_count: { $sum: 1 }
    }
  },
  {
    $sort: { post_count: -1 }
  }
]);

// Sum comment counts per post
// Business question: How many comments does each post have?
db.comments.aggregate([
  {
    $group: {
      _id: '$post_id',
      comment_count: { $sum: 1 }
    }
  },
  {
    $sort: { comment_count: -1 }
  }
]);

// Count total users
// Business question: How many users are in the system?
db.users.aggregate([
  {
    $group: {
      _id: null,
      total_users: { $sum: 1 }
    }
  }
]);

// Sum of post lengths
// Business question: What is the total word count across all posts?
db.posts.aggregate([
  {
    $group: {
      _id: null,
      total_words: { $sum: { $strLenCP: '$content' } }
    }
  }
]);

// ============================================
// === AVERAGE AND EXTREME VALUES ===
// ============================================

// Calculate average post length
// Business question: What is the average length of posts?
db.posts.aggregate([
  {
    $project: {
      title: 1,
      content_length: { $strLenCP: '$content' }
    }
  },
  {
    $group: {
      _id: null,
      avg_length: { $avg: '$content_length' }
    }
  }
]);

// Find most commented posts
// Business question: Which posts have the most comments?
db.comments.aggregate([
  {
    $group: {
      _id: '$post_id',
      comment_count: { $sum: 1 }
    }
  },
  {
    $sort: { comment_count: -1 }
  },
  {
    $limit: 10
  }
]);

// Find most active users
// Business question: Which users are most active (posts + comments)?
db.posts.aggregate([
  {
    $group: {
      _id: '$author_id',
      post_count: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'user_id',
      as: 'comments'
    }
  },
  {
    $project: {
      _id: 1,
      post_count: 1,
      comment_count: { $size: '$comments' },
      total_activity: { $add: ['$post_count', { $size: '$comments' }] }
    }
  },
  {
    $sort: { total_activity: -1 }
  }
]);

// Find longest posts
// Business question: What are the longest posts?
db.posts.aggregate([
  {
    $project: {
      title: 1,
      content_length: { $strLenCP: '$content' }
    }
  },
  {
    $sort: { content_length: -1 }
  },
  {
    $limit: 10
  }
]);

// ============================================
// === ARRAY OPERATIONS ===
// ============================================

// $unwind to flatten arrays
// Business question: Get all tags from all posts
db.posts.aggregate([
  {
    $unwind: '$tags'
  },
  {
    $group: {
      _id: '$tags',
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
]);

// $lookup to join collections
// Business question: Get posts with author information
db.posts.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'author_id',
      foreignField: '_id',
      as: 'author'
    }
  },
  {
    $unwind: '$author'
  },
  {
    $project: {
      title: 1,
      content: 1,
      author_name: '$author.username',
      author_email: '$author.email'
    }
  }
]);

// $push to create arrays
// Business question: Get all comment authors for each post
db.comments.aggregate([
  {
    $group: {
      _id: '$post_id',
      comment_authors: { $push: '$user_id' }
    }
  }
]);

// $addToSet to create unique arrays
// Business question: Get unique comment authors for each post
db.comments.aggregate([
  {
    $group: {
      _id: '$post_id',
      unique_authors: { $addToSet: '$user_id' }
    }
  }
]);

// ============================================
// === COMPLEX PIPELINES ===
// ============================================

// Get posts with comment counts
// Business question: Get posts with their comment counts
db.posts.aggregate([
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'post_id',
      as: 'comments'
    }
  },
  {
    $project: {
      title: 1,
      content: 1,
      comment_count: { $size: '$comments' }
    }
  },
  {
    $sort: { comment_count: -1 }
  }
]);

// Get users with post and comment counts
// Business question: Get user activity summary
db.users.aggregate([
  {
    $lookup: {
      from: 'posts',
      localField: '_id',
      foreignField: 'author_id',
      as: 'posts'
    }
  },
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'user_id',
      as: 'comments'
    }
  },
  {
    $project: {
      username: 1,
      email: 1,
      post_count: { $size: '$posts' },
      comment_count: { $size: '$comments' }
    }
  }
]);

// Get monthly post statistics
// Business question: What is the post count by month?
db.posts.aggregate([
  {
    $project: {
      year: { $year: '$created_at' },
      month: { $month: '$created_at' }
    }
  },
  {
    $group: {
      _id: { year: '$year', month: '$month' },
      post_count: { $sum: 1 }
    }
  },
  {
    $sort: { '_id.year': 1, '_id.month': 1 }
  }
]);

// ============================================
// === ADVANCED AGGREGATIONS ===
// ============================================

// $facet to run multiple aggregations in parallel
// Business question: Get post statistics (count, avg length, most commented)
db.posts.aggregate([
  {
    $facet: {
      post_count: [{ $count: 'total' }],
      avg_length: [
        {
          $project: {
            length: { $strLenCP: '$content' }
          }
        },
        {
          $group: {
            _id: null,
            avg: { $avg: '$length' }
          }
        }
      ],
      most_commented: [
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'post_id',
            as: 'comments'
          }
        },
        {
          $project: {
            title: 1,
            comment_count: { $size: '$comments' }
          }
        },
        {
          $sort: { comment_count: -1 }
          },
          {
            $limit: 5
          }
        ]
      }
    }
  }
]);

// $bucket to categorize data
// Business question: Categorize posts by length (short, medium, long)
db.posts.aggregate([
  {
    $project: {
      title: 1,
      content_length: { $strLenCP: '$content' }
    }
  },
  {
    $bucket: {
      groupBy: '$content_length',
      boundaries: [0, 500, 1000, 5000],
      default: 'Very Long',
      output: {
        count: { $sum: 1 },
        titles: { $push: '$title' }
      }
    }
  }
]);

// $redact to filter based on document structure
// Business question: Get posts with more than 5 comments
db.posts.aggregate([
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'post_id',
      as: 'comments'
    }
  },
  {
    $redact: {
      $cond: {
        if: { $gt: [{ $size: '$comments' }, 5] },
        then: '$$KEEP',
        else: '$$PRUNE'
      }
    }
  }
]);

// ============================================
// === EXAMPLE: NODE.JS DRIVER SYNTAX ===
// ============================================

/*
const { MongoClient } = require('mongodb');

async function run() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('blog');

  // Count posts per user
  const result = await db.collection('posts').aggregate([
    {
      $group: {
        _id: '$author_id',
        post_count: { $sum: 1 }
      }
    },
    {
      $sort: { post_count: -1 }
    }
  ]).toArray();

  console.log(result);

  await client.close();
}

run();
*/
