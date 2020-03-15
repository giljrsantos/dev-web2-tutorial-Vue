var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            requerid: true
        }
    },
    template: `
            <div class="row">
                <div class="col-md-12" id="product">
                <div class="product-imag col-md-6">
                    <img v-bind:src="image">
                </div>

                <div class="product-info col-md-6">
                    <h1>{{title }}</h1>
                    <p v-if="inStock">In Stock</p>
                    <p v-else>Out of Stock</p>
                    <p>Shipping: {{ shipping }}</p>

                    <ul>
                        <li v-for="detail in details"> {{ detail }}</li>
                    </ul>

                    <div v-for="(variant, index) in variants" 
                        :key="variant.variantId"
                        class="color-box"
                        :style="{ backgroundColor: variant.variantColor }"
                        @mouseover="updateProduct(index)" >
                        
                    </div>

                    <button v-on:click="addToCart" 
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }" >Add to Cart</button>
                </div>
                
            </div>
            <product-tabs :reviews="reviews"></product-tabs>

        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            //image: './assests/vmSocks-green.png',
            //inStock: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],

            variants: [
                {
                    variantId: 2234,
                    variantColor: 'Green',
                    variantImage: './assests/vmSocks-green.png',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'Blue',
                    variantImage: './assests/vmSocks-blue.png',
                    variantQuantity: 0
                }
            ],
            reviews: []

        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            //console.log(index)
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        },
        mounted(){
            eventBus.$on('review-submitted', productReview => {
                this.reviews.push(productReview)
            })
        }
    }

});

Vue.component('product-review', {
    template: `
        <div class="col-md-6">
        <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
        </p>

        <div class="form-group">
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name">
            </p>
        </div>
        <div class="form-group">
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
        </div>

        <div class="form-group">
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
        </div>

        <div class="form-group">   
            <p>
                <input type="submit" valeu="Submit">
            </p>
        </div>
        </form>
        </div>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            }else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
});

Vue.component('product-tabs', {
    props: {
        type: Array,
        required: true
    },
    template: `
        <div>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab">
                    {{ tab }}
                </span>

                <div v-show="selectedTab === 'Reviews'">                
                    <p v-if="!reviews.length"><br/>There are no reviews yet.</p>
                    <ul v-else>
                        <li v-for="(review, index) in reviews" :key="index">
                            <p>Name: {{ review.name }}</p>
                            <p>Rating: {{ review.rating }}</p>
                            <p>Review: {{ review.review }}</p>
                        </li>
                    </ul>
                </div>
                <product-review v-show="selectedTab === 'Make a Review'"></product-review>

                
        </div>


    `,
    data(){
        return {
            tabs: ["Reviews", "Make a Review"],
            selectedTab: 'Reviews'
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
});