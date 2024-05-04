import DB from "./DB.js";

class DatabaseManager {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async saveDocument(collection, document) {
    this.queue.push({ collection, document });
    if (!this.processing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const { collection, document } = this.queue.shift();
    const db = new DB(`${collection}`);
    try {
      const existingDoc = await db.findOne({
        subject: document.subject,
        word: document.word,
      });
      if (existingDoc) {
        const updatedDoc = this.mergeProperties(existingDoc, document);
        await db.replace({ _id: existingDoc._id }, updatedDoc);
        //db.persistence.compactDatafile();
      } else {
        await db.insert(document);
      }
    } catch (err) {
      console.error("Error processing document for " + collection + ": ", err);
    } finally {
      this.processQueue();
    }
  }

  mergeProperties(existingDoc, newDoc) {
    return Object.keys(newDoc).reduce(
      (mergedDoc, key) => {
        let oldValue = existingDoc[key];
        let newValue = newDoc[key];

        // If oldValue or newValue is not an array, make it an array
        if (!Array.isArray(oldValue)) {
          oldValue = [oldValue];
        }
        if (!Array.isArray(newValue)) {
          newValue = [newValue];
        }

        // Merge arrays by combining unique elements
        const uniqueSet = new Set([...oldValue, ...newValue]);
        mergedDoc[key] = Array.from(uniqueSet);

        return mergedDoc;
      },
      { ...existingDoc }
    );
  }
}

export default DatabaseManager;
