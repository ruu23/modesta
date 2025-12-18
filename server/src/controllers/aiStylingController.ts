import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { anthropic } from '../config/ai';
import Product from '../models/Product';
import StylingRecommendation from '../models/StylingRecommendation';

export const getStylingRecommendations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { occasion, season, budget, stylePreferences, colors } = req.body;
    const userId = req.user?._id;

    const productQuery: any = {};
    if (occasion) {
      productQuery.occasions = { $in: [occasion] };
    }

    const products = await Product.find(productQuery).limit(50);

    const productsDescription = products.map(p => ({
      id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      colors: p.colors,
      style: p.style
    }));

    const prompt = `You are a luxury modest fashion stylist. Create 3 complete outfit recommendations for:
    
Occasion: ${occasion}
Season: ${season}
Budget: ${budget}
Style Preferences: ${stylePreferences?.join(', ')}
Preferred Colors: ${colors?.join(', ')}

Available Products:
${JSON.stringify(productsDescription, null, 2)}

Return JSON format:
{
  "outfits": [
    {
      "name": "Outfit name",
      "productIds": ["id1", "id2"],
      "description": "Why this outfit works"
    }
  ],
  "reasoning": "Overall styling philosophy"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    const aiResponse = JSON.parse(responseText);

    const recommendations = await Promise.all(
      aiResponse.outfits.map(async (outfit: any) => {
        const outfitProducts = await Product.find({
          _id: { $in: outfit.productIds }
        });
        
        const totalPrice = outfitProducts.reduce((sum, p) => sum + p.price, 0);
        
        return {
          productIds: outfit.productIds,
          products: outfitProducts,
          name: outfit.name,
          description: outfit.description,
          totalPrice
        };
      })
    );

    res.json({
      recommendations,
      reasoning: aiResponse.reasoning
    });
  } catch (error) {
    console.error('AI Styling Error:', error);
    res.status(500).json({ message: 'Error generating recommendations', error });
  }
};
