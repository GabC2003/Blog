import os
import re
import sys
from glob import glob
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv

def main():
    """Main function to run the migration process."""
    # Use provided regex or default to matching markdown images (png/jpg/jpeg)
    regex_pattern = sys.argv[1] if len(sys.argv) > 1 else r"!\[(.*?)\]\((.*?\.png)\)"
    
    load_dotenv() # Load variables from .env
    
    try:
        image_regex = re.compile(regex_pattern)
    except re.error as e:
        print(f"Error compiling regex: {e}")
        sys.exit(1)

    # --- CONFIGURATION ---
    cloudinary.config(
      cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
      api_key = os.getenv("CLOUDINARY_API_KEY"),
      api_secret = os.getenv("CLOUDINARY_API_SECRET"),
      secure = True
    )
    cloudinary_folder = os.getenv("CLOUDINARY_FOLDER", "blog_images")

    # --- SCRIPT CONSTANTS ---
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    markdown_dir = os.path.join(project_root, "src", "content", "blog")
    local_image_root = os.path.join(project_root, "public")

    print("Starting image migration process to Cloudinary...")
    markdown_files = glob(os.path.join(markdown_dir, "**", "*.md"), recursive=True)
    print(f"Found {len(markdown_files)} markdown file(s) to process.")

    for md_file in markdown_files:
        print(f"\nProcessing: {os.path.basename(md_file)}")
        
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        matches = image_regex.findall(content)
        if not matches:
            print("  - No local images found.")
            continue

        updated_content = content
        for alt_text, local_path in matches:
            # Check direct path first
            local_file_system_path = os.path.join(local_image_root, local_path.lstrip('/'))
            
            # If not found, try adding 'blog/' prefix (common pattern)
            if not os.path.exists(local_file_system_path):
                 potential_path = os.path.join(local_image_root, "blog", local_path.lstrip('/'))
                 if os.path.exists(potential_path):
                     local_file_system_path = potential_path
            
            if not os.path.exists(local_file_system_path):
                print(f"  ! Warning: Image file not found: {local_file_system_path}")
                continue

            image_filename = os.path.splitext(os.path.basename(local_path))[0]
            public_id = f"{image_filename}"
            
            public_url = upload_to_cloudinary(public_id, local_file_system_path, cloudinary_folder)

            if public_url:
                print(f"  -> Replacing {local_path} with {public_url}")
                original_link = f"![{alt_text}]({local_path})"
                new_link = f"![{alt_text}]({public_url})"
                updated_content = updated_content.replace(original_link, new_link)

        if updated_content != content:
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"  * Successfully updated {os.path.basename(md_file)}")

    print("\nMigration process finished.")

def upload_to_cloudinary(public_id, local_file_path, folder):
    """Uploads a file to Cloudinary if it doesn't already exist."""
    try:
        resource = cloudinary.api.resource(public_id)
        print(f"  - Skipping, already exists: {resource['secure_url']}")
        return resource['secure_url']
    except cloudinary.api.NotFound:
        print(f"  + Uploading {os.path.basename(local_file_path)}...")
        response = cloudinary.uploader.upload(local_file_path, public_id=public_id, folder=folder)
        return response['secure_url']
    except Exception as e:
        print(f"  ! Error: {e}")
        return None

if __name__ == "__main__":
    main()
