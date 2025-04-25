import pandas as pd

def load_and_clean_csv(file_path, date_columns=[]):
    """
    Load a CSV file, strip whitespace from column names, 
    and optionally parse columns as dates.
    """
    df = pd.read_csv(file_path)
    # Standardize column names: strip, lower, replace spaces with underscores
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
    for col in date_columns:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    return df

def process_overview(overview):
    # Ensure date is parsed correctly
    overview['date'] = pd.to_datetime(overview['date'], errors='coerce')
    return overview

def process_audience(audience):
    # Ensure date is parsed correctly
    audience['date'] = pd.to_datetime(audience['date'], errors='coerce')
    return audience

def process_videos(videos):
    # Parse post_time into a datetime and extract date, day of week, and hour
    videos['post_time'] = pd.to_datetime(videos['post_time'], errors='coerce')
    videos['date'] = videos['post_time'].dt.date  # Extract date for merging if needed
    videos['day_of_week'] = videos['post_time'].dt.day_name()
    videos['hour_of_day'] = videos['post_time'].dt.hour
    
    # Calculate engagements and engagement rate for each video
    # Ensure the necessary columns exist (likes, shares, comments, video_views)
    video_cols = videos.columns
    if all(col in video_cols for col in ['likes', 'shares', 'comments', 'video_views']):
        videos['engagements'] = videos[['likes', 'shares', 'comments']].sum(axis=1)
        # Avoid division by zero; if video_views is 0, set engagement_rate to 0
        videos['engagement_rate'] = videos.apply(
            lambda row: round((row['engagements'] / row['video_views']), 4) if row['video_views'] > 0 else 0, axis=1)
    else:
        print("Warning: One or more required columns (likes, shares, comments, video_views) are missing in videos data.")
    
    return videos

def merge_daily_data(overview, audience):
    # Merge overview and audience on date (outer join to capture all records)
    merged = pd.merge(overview, audience, on='date', how='outer')
    
    # Calculate daily engagements and engagement rate from overview data.
    # Make sure the overview DataFrame has likes, shares, comments, and video_views columns.
    if all(col in merged.columns for col in ['likes', 'shares', 'comments', 'video_views']):
        merged['engagements'] = merged[['likes', 'shares', 'comments']].sum(axis=1)
        # Avoid division by zero for engagement_rate calculation
        merged['engagement_rate'] = merged.apply(
            lambda row: round((row['engagements'] / row['video_views']), 4) if row['video_views'] > 0 else 0, axis=1)
    else:
        print("Warning: Missing columns (likes, shares, comments, video_views) in merged daily data.")
    
    return merged

def main():
    # Define file paths for input CSV files – adjust paths as necessary
    overview_path = 'backend\data cleaning\overview.csv'
    audience_path = 'backend\data cleaning\\audience.csv'
    videos_path   = 'backend\data cleaning\\video.csv'
    
    # Load datasets (parsing date columns as needed)
    overview = load_and_clean_csv(overview_path, date_columns=['date'])
    audience = load_and_clean_csv(audience_path, date_columns=['date'])
    videos   = load_and_clean_csv(videos_path, date_columns=['post_time'])
    
    # Process individual datasets
    overview = process_overview(overview)
    audience = process_audience(audience)
    videos   = process_videos(videos)
    
    # Merge daily data from Overview and Audience exports
    merged_daily = merge_daily_data(overview, audience)
    
    # Output the cleaned daily data and video-level data to new CSV files
    merged_daily.to_csv('cleaned_tiktok_daily.csv', index=False)
    videos.to_csv('cleaned_tiktok_videos.csv', index=False)
    
    print("Data cleaning complete. 'cleaned_tiktok_daily.csv' and 'cleaned_tiktok_videos.csv' have been created.")

if __name__ == '__main__':
    main()
