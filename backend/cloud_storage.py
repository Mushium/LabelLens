from google.cloud import storage
storage_client = storage.Client.from_service_account_json("storage_key.json")

bucket = storage_client.get_bucket("test-bucket-qew")

blob = bucket.blob("A/im.png")


for i in bucket.list_blobs(prefix="A"):
    print(i.name)


blob.upload_from_filename("im.png")
print("Uploaded")