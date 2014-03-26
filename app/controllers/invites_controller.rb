class InvitesController < ApplicationController

  def show
    token_url = request.original_url
    token_key = token_url.split("")
    equal_sign_index = token_key.index("=") + 1
    token_key = token_key.join("")
    token_key = token_key[equal_sign_index, token_key.length-1]
    @token = Token.find_by(secret_key: token_key)
    @card = Card.find_by(id: @token.card_id)
  end

 def create
    @user = User.new(email: params[:email], password: params[:password], password_confirmation: params[:password_confirmation], first_name: params[:first_name], last_name: params[:last_name])
    if  @user.save
      session[:user_id] = @user.id
      redirect_to(:back)
    else
      render :new
    end
  end


end
