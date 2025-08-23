// Shape Network collections fetcher with real blockchain data
// Integrates with Alchemy SDK for live NFT data from Shape Network

import { Alchemy, Network } from 'alchemy-sdk';
import type { Collection } from './collections-data';

// Initialize Alchemy for Shape Network
const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY || process.env.ALCHEMY_API_KEY,
  network: Network.SHAPE_MAINNET, // Shape Network mainnet
});

// Real Shape Network Collection Contracts
// Curated from actual Shape ecosystem projects
export const SHAPE_COLLECTION_CONTRACTS = [
  "0x6E148B55e4Cd30Ea6727d7E0661c3918A6C4E9Db", // Almost Normal
  "0xdad1276ecd6d27116da400b33c81ce49d91d5831", // Shape Punks  
  "0x5fa1fdb5fe2c315abaad750dae700747f250b0c2", // DEFAULT_STATE.EXE
  "0xab3a867a6b14cc2f3286b9f03698656f8a892e9e", // COPE SALADA
  "0xf2e4b2a15872a20d0ffb336a89b94ba782ce9ba5", // DeePle
  "0x3ea45cecbf513dfc8527b585cfbf0f474d130925", // Arsonic Shape Editions
  "0xadede2a59b46ef9815e349464ea14d40195d4a2b", // Shapets
  "0xa311e4ab8afea4f152da8f02a9d789c6d43fd1f3", // Bullinus
  "0xf520f9297fc6f6ab186c911e41f715634d5a2de2", // Shape Study
  "0xbb8f2711bd4bc98223990267f771e97d2d9bc167", // Infinite Garden
  "0x4E454C9aBCaD9780F3569E494d7EdE3CB6575b01", // The Shape Inside Any Space
  "0xb6d2a34815055f2844aeb69d3386c605208a96cb", // Prismatic Daimonic Masks
  "0xe112Cf01c6cE916fFC2bDc350cC405E8357285DF", // EVENT HORIZON
  "0xB33F463369c1C53B2fD9260877565d5624CCDDd9", // whimsies
  "0x0c86384cbe928421b88ef6f3787afd9261d04346", // Copy of Noodlz
  "0x758bb513346939825a2094a1d4fbd9135514d67e", // Fragmented Order
];

// Test Shape Network connection
export async function testShapeNetworkConnection(): Promise<boolean> {
  try {
    console.log('🔗 Testing Shape Network connection...');
    
    // Try to fetch basic network info
    const blockNumber = await alchemy.core.getBlockNumber();
    console.log(`✅ Shape Network connected. Latest block: ${blockNumber}`);
    
    return true;
  } catch (error) {
    console.error('❌ Shape Network connection failed:', error);
    return false;
  }
}

// Fetch individual collection data
export async function fetchCollectionData(contractAddress: string): Promise<Collection | null> {
  try {
    console.log(`Fetching data for collection: ${contractAddress}`);

    // Fetch collection metadata and owners in parallel
    const [nftsResponse, ownersResponse] = await Promise.allSettled([
      alchemy.nft.getNftsForContract(contractAddress, {
        pageSize: 10, // Just need metadata, not all NFTs
        omitMetadata: false,
      }),
      alchemy.nft.getOwnersForContract(contractAddress),
    ]);

    // Handle potential API failures gracefully
    const nftsData = nftsResponse.status === 'fulfilled' ? nftsResponse.value : null;
    const ownersData = ownersResponse.status === 'fulfilled' ? ownersResponse.value : null;

    // Extract collection metadata
    const firstNft = nftsData?.nfts?.[0];
    const collectionName = firstNft?.contract?.name || null;
    const collectionSymbol = firstNft?.contract?.symbol || null;
    const totalSupply = firstNft?.contract?.totalSupply ? parseInt(firstNft.contract.totalSupply) : null;
    
    // Count unique owners
    const uniqueOwners = ownersData?.owners ? ownersData.owners.length : null;
    
    // Get collection image (use first NFT image or placeholder)
    const collectionImage = firstNft?.image?.originalUrl || 
                          firstNft?.image?.cachedUrl || 
                          `https://via.placeholder.com/300x300?text=${encodeURIComponent(collectionName || 'Collection')}`;

    // Build OpenSea and original URLs
    const openSeaUrl = `https://opensea.io/assets/shape/${contractAddress}`;
    const originalUrl = `https://shape.network/collection/${contractAddress}`;

    const collection: Collection = {
      contractAddress,
      name: collectionName,
      symbol: collectionSymbol,
      totalSupply,
      owners: uniqueOwners,
      image: collectionImage,
      openSeaUrl,
      originalUrl
    };

    console.log(`✅ Fetched: ${collectionName} (${collectionSymbol}) - ${totalSupply} supply, ${uniqueOwners} owners`);
    
    return collection;

  } catch (error) {
    console.error(`❌ Failed to fetch collection ${contractAddress}:`, error);
    
    // Return partial data on error
    return {
      contractAddress,
      name: `Unknown Collection (${contractAddress.slice(0, 6)}...)`,
      symbol: null,
      totalSupply: null,
      owners: null,
      image: `https://via.placeholder.com/300x300?text=Error+Loading`,
      openSeaUrl: `https://opensea.io/assets/shape/${contractAddress}`,
      originalUrl: `https://shape.network/collection/${contractAddress}`
    };
  }
}

// Fetch all Shape Network collections with progress tracking
export async function fetchAllShapeCollections(
  onProgress?: (progress: number, status: string) => void
): Promise<Collection[]> {
  const collections: Collection[] = [];
  const totalContracts = SHAPE_COLLECTION_CONTRACTS.length;

  console.log(`🚀 Fetching ${totalContracts} Shape Network collections...`);
  
  onProgress?.(0, 'Starting collection fetch...');

  for (let i = 0; i < SHAPE_COLLECTION_CONTRACTS.length; i++) {
    const contractAddress = SHAPE_COLLECTION_CONTRACTS[i];
    const progress = Math.round((i / totalContracts) * 100);
    
    onProgress?.(progress, `Fetching collection ${i + 1}/${totalContracts}...`);

    try {
      const collection = await fetchCollectionData(contractAddress);
      if (collection) {
        collections.push(collection);
      }
      
      // Brief delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error fetching collection ${i + 1}:`, error);
      // Continue with next collection
    }
  }

  console.log(`✅ Successfully fetched ${collections.length}/${totalContracts} collections`);
  onProgress?.(100, `Loaded ${collections.length} collections!`);
  
  return collections;
}

// Get collection by contract address
export async function getCollectionByAddress(contractAddress: string): Promise<Collection | null> {
  return await fetchCollectionData(contractAddress);
}

// Check if a contract address is in our curated list
export function isShapeNetworkCollection(contractAddress: string): boolean {
  return SHAPE_COLLECTION_CONTRACTS.includes(contractAddress.toLowerCase());
}