class CardsController < ApplicationController
  before_action(:load_user, {only: [:create, :new, :edit, :update, :user] })
  before_action(:load_card, {only: [:edit, :update, :destroy, :show] })
  
  def index
    respond_to do |format|
      format.html do
        @group = Group.new
        @user = current_user
        @groups = current_user.groups
        @connections = @user.connections
        @cards = @user.cards.all
      end

      format.json do
        render json: Card.all
      end
    end
  end

  def edit
    
  end

  def show
    render json: @card
  end

  def update
    @card.update(card_params)
    redirect_to user_path(@user)
  end


  def new
    @card = @user.cards.new
  end

  def create
    @card = @user.cards.create(card_params)
    redirect_to user_path(@user)
  end

  def destroy
    @card.destroy
    redirect_to user_path(@card.user_id)
  end

  def card_params
    params.require(:card).permit(:email, :card_name, :position, :organization, :phone_number, :user_id, :background_image, :ogranization_logo, :profile_picture)
  end

  def card_dashboard
    @user = current_user
    @connections = @user.connections
    @connection = @connections.find_by(card_id: params[:card_id])
    @connection_card = Card.find_by(id: @connection.card_id)
    @nytarticles = news_stories(@connection_card.organization)
    @info = company_info(@connection_card.organization)
    @company_summary = @info[:summary]
    @logo = @info[:logo]
    render json: [news: @nytarticles, company_summary: @company_summary, logo: @logo]
  end

  def news_stories(organization)
    org = organization
    org.downcase!
    org = org.gsub(/[\&\'\,']/, "")
    org = org.gsub("  "," ")
    org = org.gsub(" ","_")
    allarticles = HTTParty.get("http://api.nytimes.com/svc/search/v2/articlesearch.json?q=#{org}&api-key=#{NYTIMES_CLIENT_ID}")
    articles = allarticles["response"]["docs"].map { |article| {"Title" => "#{article["snippet"]}", "Url" => "#{article["web_url"]}" }}
  end

  def company_info(organization)
    org = organization
    org.downcase!
    org = org.gsub(/[\&\'\,']/, "")
    org = org.gsub("  "," ")
    org = org.gsub(" ","_")
    response = HTTParty.get("https://www.googleapis.com/freebase/v1/topic/en/#{org}?filter=/common/topic/article&key=#{GOOGLE_CLIENT_ID}")
    summary = response["property"]["/common/topic/article"]["values"][0]["property"]["/common/document/text"]["values"][0]["value"]
    id = response["property"]["/common/topic/article"]["values"][0]["id"]
    image = "https://usercontent.googleapis.com/freebase/v1/image/m/#{id}&key=#{GOOGLE_CLIENT_ID}"
    return {summary: summary, logo: image}
  end

private

  def load_user
    return @user = current_user
  end 

  def load_card
    return @card = Card.find(params[:id])
  end

end