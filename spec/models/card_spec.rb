require 'spec_helper'

describe Card do
  it { should belong_to(:user) }
  it { should have_many(:connections) }
end