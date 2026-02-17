import re

path = 'c:/Users/HP/Downloads/Vaani Ai/lib/government-services.ts'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find fields. We look for a block like { ... }
# We want to match fields that are clearly Date of Birth.
# Safe check: id: 'dob' or label: 'Date of Birth'
# We'll use a regex that captures the field block and check it.

def replace_field(match):
    field_content = match.group(0)
    # Check if it's a DOB field
    # 1. ID is exactly 'dob' (with quotes)
    # 2. Label is exactly 'Date of Birth' (with quotes)
    if (re.search(r"id:\s*['\"]dob['\"]", field_content) or 
        re.search(r"label:\s*['\"]Date of Birth['\"]", field_content)):
        
        # Only if it's currently 'text'
        if "type: 'text'" in field_content:
            return field_content.replace("type: 'text'", "type: 'date'")
    
    return field_content

# Match { ... } blocks
pattern = re.compile(r"\{[^{}]+\}")
updated_content = pattern.sub(replace_field, content)

# Check for specific variations like 'dob_age' if the label is 'Date of Birth / Age'
# But let's stick to the user's specific "Date of Birth" request first to be safe.

matches = updated_content.count("type: 'date'")
print(f"Updated {matches} fields to type: 'date'")

with open(path, 'w', encoding='utf-8') as f:
    f.write(updated_content)
