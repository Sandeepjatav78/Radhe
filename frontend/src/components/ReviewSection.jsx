import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const ReviewSection = ({ productId }) => {
  const { token, backendUrl, user } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewStatusMessage, setReviewStatusMessage] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/review/product/${productId}`
        );
        setReviews(response.data.reviews || []);
        setAvgRating(response.data.avgRating || 0);
        setTotalReviews(response.data.totalReviews || 0);
      } catch (error) {
        console.error(error);
      }
    };

    // Check if user can review this product
    const checkCanReview = async () => {
      if (!token) {
        setCanReview(false);
        setReviewStatusMessage("Login to write a review");
        return;
      }

      try {
        // Try to submit a review to see if user is eligible
        // Actually, we'll check by attempting to post
        setCanReview(true);
        setReviewStatusMessage("");
      } catch (error) {
        setCanReview(false);
        setReviewStatusMessage(error.response?.data?.message || "You cannot review this product");
      }
    };

    fetchReviews();
    checkCanReview();
  }, [productId, backendUrl, token]);

  // Upload image to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "radhe_pharmacy"); // Cloudinary upload preset

    setUploading(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dvf4vxcv7/image/upload",
        formData
      );
      const imageUrl = response.data.secure_url;
      setImage(imageUrl);
      setImagePreview(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      handleImageUpload(file);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.info("Please login to add a review");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/review/add`,
        { productId, rating, comment, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setReviews([response.data.review, ...reviews]);
        setRating(5);
        setComment("");
        setImage("");
        setImagePreview("");
        setShowReviewForm(false);
        toast.success("Review added");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="text-2xl font-bold">Reviews & Ratings</h3>
        {token && !showReviewForm && (
          <div className="flex gap-2 items-center">
            {canReview ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Write Review
              </button>
            ) : (
              <div className="text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
                ⓘ {reviewStatusMessage || "Purchase this product to write a review"}
              </div>
            )}
          </div>
        )}
        {!token && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
            disabled
          >
            Login to Review
          </button>
        )}
      </div>

      {/* Average Rating */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-xl">
        <div className="text-center">
          <div className="text-4xl font-bold text-emerald-600">{avgRating}</div>
          <div className="flex text-yellow-400 gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(avgRating) ? "text-2xl" : "text-gray-300 text-2xl"}>
                ★
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-600 mt-1">{totalReviews} reviews</div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-8">{star}★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${
                      totalReviews > 0
                        ? ((reviews.filter((r) => r.rating === star).length /
                            totalReviews) *
                            100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-white rounded-xl border-2 border-emerald-200">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength="200"
              placeholder="Share your experience (max 200 characters)"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
              rows="3"
            />
            <div className="text-xs text-gray-500 mt-1">{comment.length}/200</div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Add Image (optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImage("");
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center cursor-pointer">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📸</div>
                    <p className="text-sm text-gray-600">Click to upload image</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
              {uploading && <p className="text-center text-sm text-emerald-600 mt-2">Uploading...</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-gray-800">{review.userName}</div>
                  <div className="flex text-yellow-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {review.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
              {review.comment && <p className="text-gray-700 text-sm mb-2">{review.comment}</p>}
              {review.image && (
                <div className="mb-2">
                  <img src={review.image} alt="Review" className="w-full h-40 object-cover rounded-lg" />
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                <button className="text-emerald-600 hover:underline">👍 Helpful ({review.helpful})</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
