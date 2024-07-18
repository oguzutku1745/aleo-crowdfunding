// helpers/main_fetcher.ts

export const fetchDataFromUrl = async (url: string): Promise<any> => {

  try {
    const response = await fetch(`http://www.whateverorigin.org/get?url=${encodeURIComponent(url)}`)
    if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      return data.contents; // Return the contents
    } catch (error) {
      console.error('Error fetching data from URL:', error);
      throw error;
    }
  };